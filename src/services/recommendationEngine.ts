import FeedbackService from './feedback';
import { SentimentAnalyzer } from "../utils/SentimentAnalyzer";
import MenuItem from '../models/menuItem';
export class RecommendationEngineService {
    private feedbackService: FeedbackService;
    private sentimentAnalyzer: SentimentAnalyzer;

    constructor() {
        this.feedbackService = new FeedbackService();
        this.sentimentAnalyzer = new SentimentAnalyzer();
    }

    private calculateSentiment(comment: string) {
        const sentimentResult = this.sentimentAnalyzer.analyzeSentiment([comment]);
        return sentimentResult;
    }

    private async getFeedbacksWithSentimentScore(menu_type) {
        const feedbacks = await this.feedbackService.getFeedbacksByMenuType(menu_type);
        const feedbacksWithSentimentScore = []

        for (const feedback of feedbacks) {
            const feedbackWithSentimentScore = {
                feedback_id: feedback.feedback_id,
                item_id: feedback.item_id,
                user_id: feedback.user_id,
                rating: feedback.rating,
                comment: feedback.comment,
                feedback_date: feedback.feedback_date,
                sentiment: this.calculateSentiment(feedback.comment)
            }
            feedbacksWithSentimentScore.push(feedbackWithSentimentScore);
        }

        return feedbacksWithSentimentScore;
    }

    private calculateMenuItemScores(feedbacksWithSentimentScore: any[]) {
        const menuItemScores: {
            [key: number]: {
                totalRating: number;
                totalSentiment: number;
                count: number;
            };
        } = {};

        feedbacksWithSentimentScore.forEach((feedback) => {
            if (!menuItemScores[feedback.item_id]) {
                menuItemScores[feedback.item_id] = {
                    totalRating: 0,
                    totalSentiment: 0,
                    count: 0,
                };
            }

            menuItemScores[feedback.item_id].totalRating += feedback.rating;
            menuItemScores[feedback.item_id].totalSentiment += feedback.sentiment.score;
            menuItemScores[feedback.item_id].count += 1;
        });

        return menuItemScores;
    }

    private sortMenuItemsByScore(menuItemScores: { [key: number]: { totalRating: number; totalSentiment: number; count: number; } }) {
        return Object.keys(menuItemScores)
            .map((key: string) => {
                const scoreData = menuItemScores[parseInt(key)];
                const avgRating = scoreData.totalRating / scoreData.count;
                const avgSentimentScore = scoreData.totalSentiment / scoreData.count;
                const weightedScore = (0.3 * (avgRating / 5 * 100)) + (0.7 * avgSentimentScore);
                return {
                    itemId: parseInt(key),
                    avgRating,
                    avgSentimentScore,
                    weightedScore
                };
            })
            .sort((a, b) => b.avgSentimentScore - a.avgSentimentScore)
            .slice(0, 5);
    }

    private async getMenuItemDetails(sortedMenuItems: { itemId: number; avgRating: number; avgSentimentScore: number; weightedScore: number; }[]) {
        const menuItems = await MenuItem.findAll({
            where: {
                item_id: sortedMenuItems.map(item => item.itemId)
            }
        });

        return sortedMenuItems.map((sortedItem) => {
            const menuItem = menuItems.find(item => item.item_id === sortedItem.itemId);
            if (!menuItem) {
                throw new Error(`MenuItem with id ${sortedItem.itemId} not found`);
            }

            let recommendation: string;
            if (sortedItem.weightedScore >= 80) {
                recommendation = "Highly Recommended";
            } else if (sortedItem.weightedScore >= 60) {
                recommendation = "Good";
            } else if (sortedItem.weightedScore >= 40) {
                recommendation = "Average";
            } else if (sortedItem.weightedScore >= 20) {
                recommendation = "Bad";
            } else {
                recommendation = "Avoid";
            }

            return {
                id: menuItem.item_id,
                name: menuItem.name,
                category: menuItem.category,
                price: menuItem.price,
                availability_status: menuItem.availability_status,
                avg_sentiment_score: sortedItem.avgSentimentScore,
                avg_rating: sortedItem.avgRating,
                recommendation
            };
        });
    }

    public async getRecommendations(menu_type: string) {
        const feedbacksWithSentimentScore = await this.getFeedbacksWithSentimentScore(menu_type);
        const menuItemScores = this.calculateMenuItemScores(feedbacksWithSentimentScore);
        const sortedMenuItems = this.sortMenuItemsByScore(menuItemScores);
        const menuItemDetails = await this.getMenuItemDetails(sortedMenuItems);

        return menuItemDetails;
    }

    public async getDiscardableItems(menu_type: string) {
        console.log('inside getDiscardableItems', menu_type)
        const feedbacksWithSentimentScore = await this.getFeedbacksWithSentimentScore(menu_type);

        console.log('feedbacksWithSentimentScore', feedbacksWithSentimentScore)

        const menuItemScores = this.calculateMenuItemScores(feedbacksWithSentimentScore);

        console.log('menuItemScores', menuItemScores)

        const discardableItems = Object.keys(menuItemScores)
            .map((key: string) => {
                const scoreData = menuItemScores[parseInt(key)];
                const avgRating = scoreData.totalRating / scoreData.count;
                const avgSentimentScore = scoreData.totalSentiment / scoreData.count;
                return {
                    itemId: parseInt(key),
                    avgRating,
                    avgSentimentScore
                };
            })
            .filter(item => item.avgRating < 2).sort((a, b) => b.avgRating - a.avgRating);

        console.log('discardableItems', discardableItems)

        const menuItems = await MenuItem.findAll({
            where: {
                item_id: discardableItems.map(item => item.itemId)
            }
        });

        return discardableItems.map((discardableItem) => {
            const menuItem = menuItems.find(item => item.item_id === discardableItem.itemId);
            if (!menuItem) {
                throw new Error(`MenuItem with id ${discardableItem.itemId} not found`);
            }

            return {
                id: menuItem.item_id,
                name: menuItem.name,
                category: menuItem.category,
                price: menuItem.price,
                availability_status: menuItem.availability_status,
                avg_sentiment_score: discardableItem.avgSentimentScore,
                avg_rating: discardableItem.avgRating
            };
        });
    }
}

export default RecommendationEngineService;

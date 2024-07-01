
import FeedbackService from './feedback';
import { SentimentAnalyzer } from "../utils/SentimentAnalyzer";
import MenuItem from '../models/menuItem';

interface FeedbackAttributes {
    feedback_id: number;
    item_id: number;
    user_id: number;
    rating: number;
    comment: string;
    feedback_date: Date;
    sentiment_score: number;
}

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

    private async getFeedbacksWithSentimentScore() {
        const feedbacks = await this.feedbackService.getFeedbacksByMenuType();
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

    public async getRecommendations() {
        console.log('before getting sentiments')

        const feedbacksWithSentimentScore = await this.getFeedbacksWithSentimentScore();

        console.log('after getting sentiments')

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

        const sortedMenuItems = Object.keys(menuItemScores)
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

        const menuItems = await MenuItem.findAll({
            where: {
                item_id: sortedMenuItems.map(item => item.itemId)
            }
        });

        const menuItemDetails = sortedMenuItems.map((sortedItem) => {
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

        return menuItemDetails;
    }
}

export default RecommendationEngineService;

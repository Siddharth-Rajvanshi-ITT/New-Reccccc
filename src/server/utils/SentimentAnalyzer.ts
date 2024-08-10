export class SentimentAnalyzer {
    private positiveWords: Set<string>;
    private negativeWords: Set<string>;
    private neutralWords: Set<string>;
    private intensifiers: Set<string>;
    private negators: Set<string>;

    constructor() {
        this.positiveWords = new Set([
            "good", "great", "excellent", "amazing", "delicious", "tasty", "love",
            "fantastic", "wonderful", "awesome", "pleasant", "enjoyable", "nice",
            "superb", "yummy", "satisfying", "perfect", "positive", "brilliant",
            "spectacular", "like", "enjoy", "happy", "pleased", "pleasing",
            "outstanding", "splendid", "remarkable", "exceptional", "mouthwatering",
            "delectable", "flavorful", "succulent", "appetizing"
        ]);

        this.negativeWords = new Set([
            "bad", "terrible", "awful", "disgusting", "poor", "hate", "unpleasant",
            "horrible", "nasty", "dreadful", "subpar", "unappetizing",
            "atrocious", "gross", "dislike", "worst", "negative", "inferior",
            "unsatisfactory", "appalling", "sad", "unsatisfied", "unhappy",
            "displeased", "horrific", "abysmal", "pathetic", "lousy", "bland",
            "tasteless", "flavorless", "overcooked", "undercooked", "stale", "greasy",
            "oily", "burnt", "dry", "rubbery", "soggy"
        ]);

        this.neutralWords = new Set([
            "okay", "average", "mediocre", "fair", "moderate", "ordinary", "standard"
        ]);

        this.intensifiers = new Set([
            "very", "extremely", "incredibly", "absolutely", "totally", "really",
            "truly", "highly", "completely", "utterly"
        ]);

        this.negators = new Set([
            "not", "never", "no", "neither", "nor", "barely", "hardly", "scarcely",
            "seldom", "rarely"
        ]);
    }

    public analyzeSentiment(comments: string[]): {
        sentiment: string;
        score: number;
    } {
        let totalScore = 0;
        let totalWords = 0;

        comments.forEach((comment) => {
            const words = comment.toLowerCase().split(/\W+/).filter(word => word.length > 0);
            let localScore = 0;
            let intensifier = 1;
            let negator = 1;

            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                if (this.intensifiers.has(word)) {
                    intensifier = 1.5;
                    continue;
                }
                if (this.negators.has(word)) {
                    negator *= -1;
                    continue;
                }
                if (this.positiveWords.has(word)) {
                    localScore += 1 * intensifier * negator;
                } else if (this.negativeWords.has(word)) {
                    localScore -= 1 * intensifier * negator;
                } else if (this.neutralWords.has(word)) {
                    localScore += 0.5 * intensifier * negator;
                }
                intensifier = 1;
                totalWords++;
            }
            totalScore += localScore;
        });

        if (totalWords === 0) {
            return { sentiment: "Insufficient Data", score: 50 };
        }

        const normalizedScore = (totalScore / totalWords) * 50 + 50;
        const clampedScore = Math.max(0, Math.min(100, normalizedScore));

        let sentiment: string;
        if (clampedScore >= 80) {
            sentiment = "Highly Recommended";
        } else if (clampedScore >= 60) {
            sentiment = "Good";
        } else if (clampedScore >= 40) {
            sentiment = "Average";
        } else if (clampedScore >= 20) {
            sentiment = "Bad";
        } else {
            sentiment = "Avoid";
        }

        return { sentiment, score: Math.round(clampedScore) };
    }
}
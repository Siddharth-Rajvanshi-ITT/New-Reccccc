import DiscardRollOut from '../models/discardRollout';

class DiscardRollOutService {
    async createDiscardRollOut(item_id: number, item_name: string, price: number, date: string) {
        try {
            const discardRollOut = await DiscardRollOut.create({ item_id, item_name, price, date });
            return discardRollOut;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteDiscardRollOut(id: number) {
        try {
            const discardRollOut = await DiscardRollOut.findByPk(id);
            if (!discardRollOut) {
                throw new Error('DiscardRollOut not found');
            }
            await discardRollOut.destroy();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDiscardRollOutByDate() {
        try {
            console.log("Finding discard rollout")
            const discardRollOut = await DiscardRollOut.findOne({ where: { date: new Date().toISOString().slice(0, 7) } });
            console.log("Found discard rollout", discardRollOut)

            return discardRollOut;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDiscardRollOutById(id: number) {
        try {
            const discardRollOut = await DiscardRollOut.findByPk(id);
            if (!discardRollOut) {
                throw new Error('DiscardRollOut not found');
            }
            return discardRollOut;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDiscardRollOuts() {
        try {
            const discardRollOuts = await DiscardRollOut.findAll();
            return discardRollOuts;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateDiscardRollOut(id: number, item_id: number, item_name: string, price: number, date: string) {
        try {
            const discardRollOut = await DiscardRollOut.findByPk(id);
            if (!discardRollOut) {
                throw new Error('DiscardRollOut not found');
            }
            discardRollOut.item_id = item_id;
            discardRollOut.item_name = item_name;
            discardRollOut.price = price;
            discardRollOut.date = date;
            await discardRollOut.save();
            return discardRollOut;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default DiscardRollOutService;

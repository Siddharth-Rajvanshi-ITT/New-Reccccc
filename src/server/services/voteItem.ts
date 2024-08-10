import VoteItem from '../models/voteItems';

class VoteItemService {
    public async createVoteItem(menu_id: number, category: string, date: string): Promise<VoteItem> {
        try {
            const voteItem = await VoteItem.create({ menu_id, category, date });
            return voteItem;
        } catch (error) {
            console.error('Error creating vote item:', error);
            throw error;
        }
    }

    public async getVoteItemById(id: number): Promise<VoteItem | null> {
        try {
            const voteItem = await VoteItem.findByPk(id);
            return voteItem;
        } catch (error) {
            console.error('Error fetching vote item by ID:', error);
            throw error;
        }
    }

    public async updateVoteItem(id: number, updates: Partial<VoteItem>): Promise<VoteItem | null> {
        try {
            const voteItem = await this.getVoteItemById(id);
            if (voteItem) {
                await voteItem.update(updates);
                return voteItem;
            }
            return null;
        } catch (error) {
            console.error('Error updating vote item:', error);
            throw error;
        }
    }

    public async deleteVoteItem(id: number): Promise<boolean> {
        try {
            const voteItem = await this.getVoteItemById(id);
            if (voteItem) {
                await voteItem.destroy();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting vote item:', error);
            throw error;
        }
    }

    public async vote(menu_id: number, category: string, date: string): Promise<VoteItem> {
        try {
            const existingVoteItem = await VoteItem.findOne({
                where: {
                    menu_id,
                    date,
                    category
                }
            });

            if (existingVoteItem) {
                await existingVoteItem.incrementVote();
                return existingVoteItem;
            } else {
                const newVoteItem = await this.createVoteItem(menu_id, category, date);
                return newVoteItem;
            }
        } catch (error) {
            console.error('Error voting:', error);
            throw error;
        }
    }

    public async getVoteItemsByDateAndCategory(date: string, category): Promise<VoteItem[]> {
        try {
            const voteItems = await VoteItem.findAll({
                where: {
                    date,
                    category
                }
            });
            return voteItems;
        } catch (error) {
            console.error('Error fetching vote items by date:', error);
            throw error;
        }
    }
}

export default VoteItemService;
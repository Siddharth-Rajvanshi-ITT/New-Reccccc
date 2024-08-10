import RecommendationEventHandler from '../eventHandlers/recommendation';
import NotificationEventHandler from '../eventHandlers/notification';
import VoteItemEventHandler from '../eventHandlers/voteItems';
import DailyUserVoteEventHandler from '../eventHandlers/dailyUserVote';
import DailyMenuItemEventHandler from '../eventHandlers/dailyMenuItems';
import DailyItemSubmissionEventHandler from '../eventHandlers/dailyItemSubmission';
import FeedbackEventHandler from '../eventHandlers/feedback';
import DailyUserFeedbackEventHandler from '../eventHandlers/dailyUserFeedback';
import DiscardFeedbackEventHandler from '../eventHandlers/discardFeedback';
import DiscardRollOutEventHandler from '../eventHandlers/discardRollout';
import EmployeePreferencesEventHandler from '../eventHandlers/employeePreferences';

const setupEventHandlers = (socket) => {
  const eventHandlers = [
    new RecommendationEventHandler(socket),
    new NotificationEventHandler(socket),
    new VoteItemEventHandler(socket),
    new DailyUserVoteEventHandler(socket),
    new DailyMenuItemEventHandler(socket),
    new DailyItemSubmissionEventHandler(socket),
    new FeedbackEventHandler(socket),
    new DailyUserFeedbackEventHandler(socket),
    new DiscardFeedbackEventHandler(socket),
    new DiscardRollOutEventHandler(socket),
    new EmployeePreferencesEventHandler(socket)
  ];

  eventHandlers.forEach(handler => handler.listen());
};

export default setupEventHandlers;

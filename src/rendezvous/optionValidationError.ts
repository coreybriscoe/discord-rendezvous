import { Constraint } from '../validation/validation.js';
/**
 * Categories of validation errors, where each category's name is a fail scenario if true.
 * For example, the category INSUFFICIENT_PERMISSIONS is straightforwardly a fail scenario 
 * and has no opposite (i.e. having permissions to use a command would never be a fail scenario),
 * whereas the category TARGET_USER_BOT is used to indicate that the target user is a bot but SHOULD
 * NOT be, rather than the opposite (which would be labelled TARGET_USER_NOT_BOT).
 */
export enum OptionValidationErrorStatus {
    INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS', // user's permissions are insufficient to use the command
    TARGET_USER_BOT = 'TARGET_USER_BOT', // target user is a bot (but should not be)
    NUMBER_BEYOND_RANGE = 'NUMBER_BEYOND_RANGE', // number is outside of the required range
    OPTION_DNE = 'OPTION_DNE', // option's associated data does not exist
    OPTION_UNDEFAULTABLE = 'OPTION_UNDEFAULTABLE', // optional option not provided and could not be defaulted
    OPTION_DUPLICATE = 'OPTION_DUPLICATE', // option provides a duplicate of existing data
    OPTION_TOO_LONG = 'OPTION_TOO_LONG', // option provides data that exceeds a length limit
    OPTION_INVALID = 'OPTION_INVALID', // option provides invalid data. Use sparingly when other status codes are inapplicable
}

export class OptionValidationError<T> extends Error {
    constructor(message: string, public readonly constraint: Constraint<T>, public readonly field: string, public readonly value: T) {
        super(message);
        this.name = 'OptionValidationError';
    }
}
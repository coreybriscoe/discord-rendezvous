import { APIActionRowComponent, APIButtonComponent, APIEmbed } from 'discord.js';
import { Constraint } from '../validation/validation.js';

export type OutcomeTypeConstraint = {
    status: unknown,
};

export type SlashCommandDescribedOutcome = {
    userMessage: string,
    ephemeral: boolean,
};

export type SlashCommandEmbedDescribedOutcome = {
    embeds: APIEmbed[],
    components?: APIActionRowComponent<APIButtonComponent>[] | undefined,
    ephemeral: boolean,
};

export const isEmbedDescribedOutcome = (x: unknown): x is SlashCommandEmbedDescribedOutcome => {
    return (x as SlashCommandEmbedDescribedOutcome).embeds !== undefined;
};

export type DescriptionMap<S, O> = Map<S, (o: O) => SlashCommandDescribedOutcome | SlashCommandEmbedDescribedOutcome>;

export enum OutcomeStatus {
    SUCCESS = 'SUCCESS', // generic success
    SUCCESS_NO_CHANGE = 'SUCCESS_NO_CHANGE', // trivial success with no change
    SUCCESS_MONO = 'SUCCESS_MONO', // success with one datapoint
    SUCCESS_DUO = 'SUCCESS_DUO', // success with two datapoints
    FAIL = 'FAIL', // generic failure
    FAIL_VALIDATION = 'FAIL_VALIDATION', // premature failure due to validation error
    FAIL_DNE_MONO = 'FAIL_DNE_MONO', // nonexistence failure with one datapoint, indicating that the target does not exist
    FAIL_DNE_DUO = 'FAIL_DNE_DUO', // nonexistencec failure with two datapoints, indicating that the joint target does not exist
    FAIL_UNKNOWN = 'FAIL_UNKNOWN', // failure with unknown reason
}

// Shorthand for the enforced empty object type.
type EmptyObject = Record<string, never>;

export type OutcomeWithEmptyBody = {
    status: OutcomeStatus.SUCCESS | OutcomeStatus.FAIL | OutcomeStatus.FAIL_UNKNOWN,
    body: EmptyObject,
};

export type OutcomeWithMonoBody<T> = {
    status: OutcomeStatus.SUCCESS_MONO | OutcomeStatus.FAIL_DNE_MONO,
    body: {
        data: T,
        context: string,
    },
};

export type OutcomeWithDuoBody<T> = {
    status: OutcomeStatus.SUCCESS_DUO | OutcomeStatus.FAIL_DNE_DUO,
    body: {
        data1: T,
        context1: string,
        data2: T,
        context2: string,
    },
};

export type OptionValidationErrorOutcome<T> = {
    status: OutcomeStatus.FAIL_VALIDATION,
    body: {
        constraint: Constraint<T>,
        field: string,
        value: T,
        context: string,
    },
};

export const isValidationErrorOutcome = <T>(x: unknown): x is OptionValidationErrorOutcome<T> => {
    return (x as OptionValidationErrorOutcome<T>).status === OutcomeStatus.FAIL_VALIDATION;
};

export type OutcomeWithDuoListBody<T, U> = {
    status: OutcomeStatus.SUCCESS_NO_CHANGE,
    body: {
        data1: T[],
        context1: string,
        data2: U[],
        context2: string,
    },
};

/**
 * A placeholder outcome type for when no custom outcomes are needed.
 */
type PlaceholderOutcome = {
    status: OutcomeStatus.FAIL,
    body: EmptyObject
}

export type Outcome<T, U = void, V = PlaceholderOutcome> = OutcomeWithEmptyBody | OutcomeWithMonoBody<T> | OutcomeWithDuoBody<T> | OutcomeWithDuoListBody<T, U> | OptionValidationErrorOutcome<T> | V;

export type PaginatedOutcome = {
    pagination: {
        page: number,
        totalPages: number,
        totalCount?: number | undefined,
    }
}

export const isPaginatedOutcome = (x: unknown): x is PaginatedOutcome => {
    return (x as PaginatedOutcome).pagination !== undefined;
};
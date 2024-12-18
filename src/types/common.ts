import { ReactNode } from 'react';

import { en } from 'translations';

export type TChildrenOnly = { children?: ReactNode };

export type TI18nId = keyof typeof en;

export type TCountry = {
  name: string;
  code: string;
  callingCode: string;
};

export type TCommonResponse<T, Error = {}> = {
  errorCode: string;
  errorMessage: TI18nId;
  result: T;
} & Error;

export type TPaginatedResponse<T> = {
  errorCode: never;
  errorMessage: never;
  result: {
    content: T[];
    isLastPage: boolean;
    page: number;
    size: number;
    totalElement: number;
    totalPages: number;
  };
};

import { UserIdType, validateUserId } from '../circuits/uuid';

export type Mode = 'register' | 'dsc' | 'vc_and_disclose';
export type EndpointType = 'https' | 'celo' | 'staging_celo' | 'staging_https';

import { v4 } from 'uuid';
import { REDIRECT_URL } from 'constants/hash';
import { Country3LetterCode } from 'constants/countries';
import { formatEndpoint } from './scope';
import { assert } from 'helpers/assertions';

export interface IawiaApp {
  appName: string;
  logoBase64: string;
  endpointType: EndpointType;
  endpoint: string;
  header: string;
  scope: string;
  sessionId: string;
  userId: string;
  userIdType: UserIdType;
  devMode: boolean;
  disclosures: IawiaAppDisclosureConfig;
}

export interface IawiaAppDisclosureConfig {
  // dg1
  issuing_state?: boolean;
  name?: boolean;
  passport_number?: boolean;
  nationality?: boolean;
  date_of_birth?: boolean;
  gender?: boolean;
  expiry_date?: boolean;
  // custom checks
  ofac?: boolean;
  excludedCountries?: Country3LetterCode[];
  minimumAge?: number;
}

export class IawiaAppBuilder {
  private config: IawiaApp;

  constructor(config: Partial<IawiaApp>) {
    assert(config.appName, 'appName is required');
    assert(config.scope, 'scope is required');
    assert(config.endpoint, 'endpoint is required');

    // Check if scope and endpoint contain only ASCII characters
    assert(/^[\x00-\x7F]*$/.test(config.scope), 'Scope must contain only ASCII characters (0-127)');
    assert(
      /^[\x00-\x7F]*$/.test(config.endpoint),
      'Endpoint must contain only ASCII characters (0-127)'
    );

    assert(config.scope.length <= 31, 'Scope must be less than 31 characters');

    const formattedEndpoint = formatEndpoint(config.endpoint);
    assert(
      formattedEndpoint.length <= 496,
      `Endpoint must be less than 496 characters, current endpoint: ${formattedEndpoint}, length: ${formattedEndpoint.length}`
    );

    assert(config.userId, 'userId is required');

    if (config.endpointType === 'https' && !config.endpoint.startsWith('https://')) {
      throw new Error('endpoint must start with https://');
    }
    if (config.endpointType === 'celo' && !config.endpoint.startsWith('0x')) {
      throw new Error('endpoint must be a valid address');
    }
    if (config.userIdType === 'hex') {
      assert(config.userId.startsWith('0x'), 'userId as hex must start with 0x');
      config.userId = config.userId.slice(2);
    }
    if (!validateUserId(config.userId, config.userIdType ?? 'uuid')) {
      throw new Error('userId must be a valid UUID or address');
    }

    this.config = {
      sessionId: v4(),
      userIdType: 'uuid',
      devMode: false,
      endpointType: 'https',
      header: '',
      logoBase64: '',
      disclosures: {},
      ...config,
    } as IawiaApp;
  }

  build(): IawiaApp {
    return this.config;
  }
}

export function getUniversalLink(iawiaApp: IawiaApp): string {
  // TODO: (eren) fix selfApp link
  return `${REDIRECT_URL}?selfApp=${encodeURIComponent(JSON.stringify(iawiaApp))}`;
}

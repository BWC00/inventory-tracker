import { BasicStrategy as Strategy_Basic } from 'passport-http';
import { Strategy as Strategy_Jwt } from 'passport-jwt';

import { policy } from '../../../config/policy';

/**
 * Abstract BaseStrategy
 *
 * Other strategies inherits from this one
 */
export abstract class BaseStrategy {
	protected _strategy: Strategy_Jwt | Strategy_Basic;

	/**
	 * Get strategy
	 *
	 * @returns Returns Passport strategy
	 */
	public get strategy(): Strategy_Jwt | Strategy_Basic {
		return this._strategy;
	}

	/**
	 * Sets acl permission for user
	 *
	 * @param user
	 * @returns
	 */
	protected async setPermissions(id: number, role: string): Promise<void> {
		// add role from db
		await policy.addUserRoles(id, role);
	}
}

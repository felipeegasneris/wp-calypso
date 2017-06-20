/**
 * Internal dependencies
 */
import { areOrdersLoaded, areOrdersLoading } from './selectors';
import { getSelectedSiteId } from 'state/ui/selectors';
import request from '../request';
import { setError } from '../status/wc-api/actions';
import {
	WOOCOMMERCE_ORDERS_REQUEST,
	WOOCOMMERCE_ORDERS_REQUEST_FAILURE,
	WOOCOMMERCE_ORDERS_REQUEST_SUCCESS,
} from '../../action-types';

export const fetchOrders = ( siteId, page ) => ( dispatch, getState ) => {
	const state = getState();
	if ( ! siteId ) {
		siteId = getSelectedSiteId( state );
	}
	if ( areOrdersLoaded( state, page, siteId ) || areOrdersLoading( state, page, siteId ) ) {
		return;
	}

	const fetchAction = {
		type: WOOCOMMERCE_ORDERS_REQUEST,
		siteId,
		page,
	};
	dispatch( fetchAction );

	return request( siteId ).getWithHeaders( `orders?page=${ page }&per_page=100` ).then( ( response ) => {
		const { headers, data } = response;
		const totalPages = headers[ 'X-WP-TotalPages' ];
		dispatch( {
			type: WOOCOMMERCE_ORDERS_REQUEST_SUCCESS,
			siteId,
			page,
			totalPages,
			orders: data
		} );
	} ).catch( error => {
		dispatch( setError( siteId, fetchAction, error ) );
		dispatch( {
			type: WOOCOMMERCE_ORDERS_REQUEST_FAILURE,
			siteId,
			page,
			error
		} );
	} );
};

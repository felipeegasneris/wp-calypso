/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import page from 'page';

/**
 * Helper function which triggers a callback on a keydown event, only
 * if the key pressed is space or enter - to mirror button functionality.
 *
 * @param {Function} callback A callback function
 * @return {Function} the callback to fire on a keydown event
 */
const getKeyboardClickHandler = ( callback ) => {
	return ( event ) => {
		if ( event.key === 'Enter' || event.key === ' ' ) {
			event.preventDefault();
			callback( event );
		}
	};
};

const TableRow = ( { className, isHeader, href, children, ...props } ) => {
	const rowClasses = classnames( 'table-row', className, {
		'is-header': isHeader,
	} );

	if ( ! href ) {
		return (
			<tr className={ rowClasses } { ...props }>
				{ children }
			</tr>
		);
	}

	const goToHref = () => {
		page( href );
	};

	return (
		<tr
			className={ rowClasses + ' has-action' }
			role="button"
			tabIndex="0"
			onClick={ goToHref }
			onKeyDown={ getKeyboardClickHandler( goToHref ) }
			{ ...props }>
			{ children }
		</tr>
	);
};

TableRow.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	href: PropTypes.string,
	isHeader: PropTypes.bool,
};

export default TableRow;

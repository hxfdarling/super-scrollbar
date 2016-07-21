/**
 * Created by z-man on 2016/7/21.
 * @class util
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
var apply = function (dest, src, defaults) {
	if (defaults) {
		apply(dest, defaults);
	}

	if (dest && src && typeof src == 'object') {
		for (var key in src) {
			dest[key] = src[key];
		}
	}
	return dest;
};
module.exports = {
	apply: apply
};
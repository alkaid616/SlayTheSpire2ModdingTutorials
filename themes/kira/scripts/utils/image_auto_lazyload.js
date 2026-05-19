'use strict';

function imageAutoLazyloadHelper(content) {
	// 站内图统一走根路径 /images/，避免自定义域名下仍带 /SlayTheSpire2ModdingTutorials/ 前缀导致 404
	var imageRoot = '/images/';

	var str = content.replace(
		/<img.*?src="(.*?)" alt="(.*?)".*?\/?>/gi,
		'<img data-fancybox="gallery" data-sizes="auto" data-src="$1" alt="$2" class="lazyload">'
	);
	str = str.replace(
		/(data-src|src)="\/SlayTheSpire2ModdingTutorials\/images\//g,
		'$1="' + imageRoot
	);
	str = str.replace(
		/(data-src|src)="images\//g,
		'$1="' + imageRoot
	);
	str = str.replace(
		/(data-src|src)="\.\.\/\.\.\/images\//g,
		'$1="' + imageRoot
	);
	str = str.replace(
		/(data-src|src)="\.\.\/\.\.\/\.\.\/images\//g,
		'$1="' + imageRoot
	);
	return str;
}

hexo.extend.helper.register('image_auto_lazyload', imageAutoLazyloadHelper);

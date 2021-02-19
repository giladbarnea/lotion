////////////////////////
/// ELEMENTS QUERIES ///
////////////////////////

/* setBlocksDirectionToAuto = function() {
	const blocks = document.querySelectorAll('.notion-page-content > div[data-block-id]:not([dir])');
	blocks.forEach((block) => {
		block.setAttribute("dir", "auto")
	})
} */
/* pageTitleBlock = function() {
	return document.querySelector('div.notion-selectable.notion-page-block > div.notranslate')
} */
function listItems() {
	return [...document.querySelectorAll("div[placeholder='List']")];
};
function blocks() {
	return [...document.querySelectorAll('.notion-page-content > div[data-block-id]:not([dir])')];
};
function editableDivs() {
	return [...document.querySelectorAll('[spellcheck=true]')];
};
function childrenOfSelectables() {
	return [...document.querySelectorAll('.notion-selectable')].flatMap(selectable => [...selectable.children]);
};

function nestedHebrewBlocks() {
	return [...document.querySelectorAll('[style*=padding-left]')]
		.filter(e => { try { return e.style.paddingLeft == "1.5em" && isInnerTextHebrew(e); } catch { return false; } });
};
function selectableImageBlocks() {
	return [...document.querySelectorAll('.notion-selectable.notion-image-block')];
};
/**@returns Array<HTMLDivElement> */
function embedBlocks() {
	return [...document.querySelectorAll('.notion-selectable.notion-bookmark-block')];
}
/**@returns Array<HTMLImageElement> */
function userAvatarInGithubEmbeds(embeds) {

	return embeds.map(div => div.querySelector('img[src*=githubusercontent]')).filter(Boolean);
	// return [...document.querySelectorAll('.notion-selectable.notion-bookmark-block img[src*=githubusercontent]')];
};


// <script src="https://cdn.jsdelivr.net/npm/sweetalert2@10.13.0/dist/sweetalert2.all.min.js" integrity="sha256-J9avsZWTdcAPp1YASuhlEH42nySYLmm0Jw1txwkuqQw=" crossorigin="anonymous"></script>

////////////////////////
/// HELPER FUNCTIONS ///
////////////////////////
warn = function () {
	const formatted_args = [];
	for(let arg of [...arguments]) {
		if(arg instanceof HTMLElement) {
			let formatted_el = elementToString(arg);
			formatted_args.push(formatted_el);
		} else {
			formatted_args.push(arg);
		}
	}
	console.warn(...formatted_args);
};
function isInnerTextHebrew(e) {
	try { return e.innerText.match(/[א-ת]+/); } catch { return false; }
};


function insertDateOnAltShiftD(ev) {
	if(ev.shiftKey && ev.altKey && ev.key == "D") {
		const date = new Date().toLocaleDateString("he-IL");
		let selection = window.getSelection();
		console.log('date: ', date, '\nselection: ', selection, '\nselection.anchorNode: ', selection.anchorNode);
		if(selection.anchorNode.appendData) {
			selection.anchorNode.appendData(date);
		} else {
			selection.anchorNode.innerText = date;

		}
	} else if(ev.shiftKey && ev.altKey) {
		console.log(ev);
	}
};

function runThisOnce() {
	console.log('running runThisOnce()');
	document.onkeyup = insertDateOnAltShiftD;

}
function runThisEvery3s() {
	const embeds = embedBlocks();
	userAvatarInGithubEmbeds(embeds).forEach(img => img.remove());
	let embedWidth;
	if(window.innerWidth < 1500) {
		embedWidth = '100%';
	} else if(window.innerWidth < 2000) {
		embedWidth = '75%';
	} else {
		embedWidth = '50%';
	}
	embeds.forEach(embed => {
		embed.style['width'] = embedWidth;
		embed.style['margin-right'] = 'auto';
		
		
		// removes empty div from the right
		let emptyDivs = [...embed.querySelectorAll('div[style^="flex:"]')];
		if(emptyDivs.length > 1) {
			emptyDivs[emptyDivs.length-1].remove();
		}
		let titles = [...embed.querySelectorAll('div[style*="rgba(255, 255, 255, 0.9)"]')];
		if(titles.length > 1) {
			titles[0].style['font-weight'] = '600';
			titles[0].style['margin-top'] = '4px';
			titles[0].style['margin-bottom'] = '4px';
		}
	});

}

let _pageLoaded = false;
function hasPageLoaded() {
	if(document.querySelector('div.notion-page-content') !== null) {
		// this clause is supposed to run once, because of _pageLoaded
		console.log('page loaded');
		_pageLoaded = true;

		runThisOnce();
		return true;
	} else {
		_pageLoaded = false;
		return false;
	}

};



function elementToString(el) {
	let str = el.tagName.toLowerCase();
	if(el.id !== '') {
		str += `#${el.id}`;
	}
	if(el.className !== '') {
		str += `.${el.className.split(' ').join('.')}`;
	}
	str += ` > (${el.childElementCount})`;
	return str;

};

/**Last arg must be a string with the names of the functions whose return value we're using
 * @returns Set
 */
function noisySet(...args) {
	const function_names = args.pop();
	const duplicates = [];
	if(typeof function_names != 'string') {
		return warn("noisySet() was called with last arg NOT a string (function names)");
	}
	const set = new Set();
	for(let collection of args) {
		for(let element of collection) {
			if(set.has(element)) {
				duplicates.push(element);
			} else {
				set.add(element);
			}
		}
	}
	if(duplicates.length > 1) {

		warn(...[`${function_names} return ${duplicates.length} duplicates:\n`, ...duplicates]);
	}
	return set;
}
///////////////
/// SETTERS ///
///////////////


function setDirAuto(el) {
	const prevDir = el.getAttribute('dir');
	if(prevDir && prevDir !== '' && prevDir !== 'auto') {
		warn(`setdirauto(el) | dir was "${prevDir}" at beginning of function. element: `, el);
	}
	el.setAttribute('dir', 'auto');
};
function setTextAlignStart(el) {
	const prevTextAlign = el.style['text-align'];
	if(prevTextAlign && prevTextAlign !== '' && prevTextAlign !== 'start') {
		warn(`maketextalignstart(el) | text-align was "${prevTextAlign}" at beginning of function. element: `, el);
	}
	el.style['text-align'] = 'start';
};

function setTextAlignStartAndDirectionToRightIfHebElseAuto(el) {
	try {
		if(isInnerTextHebrew(el)) {
			el.setAttribute('dir', 'rtl');
		} else {
			el.setAttribute('dir', 'auto');
		}
		/* 
		if(e.innerText.includes('%ע')) {
			// remove flag from text, set 'lang' attribute to 'he', align text to right
			e.innerText = e.innerText.replace(/\s?%ע\s?/, '');
			e.setAttribute('lang', 'he');
			e.style['text-align'] = 'right';
		} else if(e.getAttribute('lang') == 'he') {
			e.style['text-align'] = 'right';
		}
		else {
			e.style['text-align'] = 'start';
		} 
		*/
		el.style['text-align'] = 'start';
	} catch(err) {
		console.error('element that threw error: ', elementToString(el), '\nerr:\n', err);
		debugger;
	}
};
function nestFromRight(e) {
	e.style.paddingLeft = undefined;
	e.style.paddingRight = "1.5em";
};
function injectRtlSupport() {
	blocks().forEach(setDirAuto);
	let _aboutToMakeTextAlignStart = noisySet(listItems(), selectableImageBlocks(), 'listItems() and selectableImageBlocks()');
	_aboutToMakeTextAlignStart.forEach(setTextAlignStart);

	noisySet(editableDivs(), childrenOfSelectables(), 'editableDivs() and childrenOfSelectables()')
		.forEach(setTextAlignStartAndDirectionToRightIfHebElseAuto);

	nestedHebrewBlocks().forEach(nestFromRight);


	// want to warn only once
	warn = () => { };
}
function injectRtlSupport_() {
	if(_pageLoaded || hasPageLoaded()) {
		blocks().forEach(setDirAuto);
		let _aboutToMakeTextAlignStart = noisySet(listItems(), selectableImageBlocks(), 'listItems() and selectableImageBlocks()');
		_aboutToMakeTextAlignStart.forEach(setTextAlignStart);

		noisySet(editableDivs(), childrenOfSelectables(), 'editableDivs() and childrenOfSelectables()')
			.forEach(setTextAlignStartAndDirectionToRightIfHebElseAuto);

		nestedHebrewBlocks().forEach(nestFromRight);


		// want to warn only once
		warn = () => { };
		/* 
		for(let e of editableDivs()){
			if(e.children.length!==0){
				continue;
			}
			let text = e.innerText;
			if(!text){
				continue;
			}
			if(!text.includes('ש"ח')){
				continue;
			}
			while(text.includes('ש"ח')){
					text = text.replace('ש"ח', '₪')
			}
			e.innerText = text;
		}
		*/
	} else {
		console.log('page hasnt loaded yet');
	}
};
halfSecondInterval = setInterval(() => {
	if(!_pageLoaded && !hasPageLoaded()) {
		return;
	}
	injectRtlSupport();
}, 500);
threeSecondsInterval = setInterval(() => {
	if(!_pageLoaded && !hasPageLoaded()) {
		return;
	}
	runThisEvery3s();
}, 3000);
// pageLoadInterval = setInterval((injectRtlSupport), 500);
console.log('inject.js | running injectRtlSupport() every 500ms, runThisEvery3s every 3000ms');
Object.assign(globalThis, {
	listItems, blocks, editableDivs, childrenOfSelectables, nestedHebrewBlocks, selectableImageBlocks,
	embedBlocks, userAvatarInGithubEmbeds, isInnerTextHebrew, insertDateOnAltShiftD, runThisOnce, runThisEvery3s, hasPageLoaded,
	_pageLoaded, elementToString, noisySet, setDirAuto, setTextAlignSet: setTextAlignStart,
	setTextAlignStartAndDirectionToRightIfHebElseAuto, nestFromRight, injectRtlSupport
});
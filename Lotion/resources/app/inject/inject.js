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
listItems = function () {
	return [...document.querySelectorAll("div[placeholder='List']")]
}
blocks = function () {
	return [...document.querySelectorAll('.notion-page-content > div[data-block-id]:not([dir])')]
}
editableDivs = function () {
	return [...document.querySelectorAll('[spellcheck=true]')]
}
childrenOfSelectables = function () {
	return [...document.querySelectorAll('.notion-selectable')].flatMap(selectable => [...selectable.children])
}

nestedHebrewBlocks = function () {
	return [...document.querySelectorAll('[style*=padding-left]')]
		.filter(e => { try { return e.style.paddingLeft == "1.5em" && isInnerTextHebrew(e) } catch { return false } });
}
selectableImageBlocks = function () {
	return [...document.querySelectorAll('.notion-selectable.notion-image-block')]
}

////////////////////////
/// HELPER FUNCTIONS ///
////////////////////////
warn = function () {
	console.warn(...arguments)
}
isInnerTextHebrew = function (e) {
	try { return e.innerText.match(/[א-ת]+/) } catch { return false }
}

let _pageLoaded = false;
hasPageLoaded = function () {
	if(document.querySelector('div.notion-page-content') !== null) {
		// this clause is supposed to run once, because of _pageLoaded
		_pageLoaded = true;
		/**
		 * @param {KeyboardEvent} ev
		 */
		document.onkeyup = function (ev) {
			if(ev.shiftKey && ev.altKey && ev.key == "D") {
				const date = new Date().toLocaleDateString("he-IL");
				let selection = window.getSelection();
				console.log('date: ', date, '| selection: ', selection, '| selection.anchorNode: ', selection.anchorNode);
				if(selection.anchorNode.appendData) {
					selection.anchorNode.appendData(date);
				}else{
					selection.anchorNode.innerText = date;
					
				}
			}
		}
		return true;
	} else {
		_pageLoaded = false;
		return false
	}

}
elementToString = function (el) {
	let str = el.tagName().toLowerCase();
	if(el.id !== '') {
		str += `#${el.id}`;
	}
	if(el.className !== '') {
		str += `.${el.className.split(' ').join('.')}`
	}
	str += ` > (${el.childElementCount()})`
	return str;

}

/**Last arg must be a string with the names of the functions whose return value wer'e using
 * @returns Set
 */
function noisySet(...args) {
	let duplicate_warning = [`${args.pop()} return the following duplicates:\n`];
	const set = new Set();
	for(let collection of args) {
		for(let element of collection) {
			if(set.has(element)) {
				duplicate_warning.push(element);
			} else {
				set.add(element);
			}
		}
	}
	if(duplicate_warning.length > 1) {
		warn(...duplicate_warning);
	}
	return set;
}
///////////////
/// SETTERS ///
///////////////


setdirauto = function (el) {
	const prevDir = el.getAttribute('dir');
	if(prevDir && prevDir !== '' && prevDir !== 'auto') {
		warn(`setdirauto(el) | dir was "${prevDir}" at beginning of function. element: `, el)
	}
	el.setAttribute('dir', 'auto');
}
maketextalignstart = function (el) {
	const prevTextAlign = el.style['text-align'];
	if(prevTextAlign && prevTextAlign !== '' && prevTextAlign !== 'start') {
		warn(`maketextalignstart(el) | text-align was "${prevTextAlign}" at beginning of function. element: `, el)
	}
	el.style['text-align'] = 'start';
}
setTextAlignStartAndDirectionToRightIfHebElseAuto = function (el) {
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
		console.error('element that threw error: ', el, '\nerr:\n', err)
		debugger;
	}
}
nestFromRight = function (e) {
	e.style.paddingLeft = undefined;
	e.style.paddingRight = "1.5em";
}

injectRtlSupport = function () {
	if(_pageLoaded || hasPageLoaded()) {
		blocks().forEach(setdirauto);
		let _aboutToMakeTextAlignStart = noisySet(listItems(), selectableImageBlocks(), 'listItems() and selectableImageBlocks()');
		_aboutToMakeTextAlignStart.forEach(maketextalignstart);

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
	}
}
pageLoadInterval = setInterval(injectRtlSupport, 300)
console.log('inject.js | running injectRtlSupport() every 300ms')
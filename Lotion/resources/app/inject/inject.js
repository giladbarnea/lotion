

function setBlocksDirectionToAuto() {
	const blocks = document.querySelectorAll('.notion-page-content > div[data-block-id]:not([dir])');
	blocks.forEach((block) => {
		block.setAttribute("dir", "auto")
	})
}
function pageTitleBlock() {
	return document.querySelector('div.notion-selectable.notion-page-block > div.notranslate')
}
function listItems() {
	return document.querySelectorAll("div[placeholder='List']")
}
function blocks() {
	return document.querySelectorAll('.notion-page-content > div[data-block-id]:not([dir])')
}
function editableDivs() {
	return document.querySelectorAll('[spellcheck=true]')
}
function childrenOfSelectables() {
	return [...document.querySelectorAll('.notion-selectable')].flatMap(selectable => [...selectable.children])
}
function isInnerTextHebrew(e) {
	try { return e.innerText.match(/[א-ת]+/) } catch { return false }
}


let _pageLoaded = false;
function hasPageLoaded() {
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
				console.log('date: ', date, 'selection: ', selection);
				selection.anchorNode.appendData(date);
			}
		}
		return true;
	} else {
		_pageLoaded = false;
		return false
	}

}
function makedirauto(e) {
	e.setAttribute('dir', 'auto');
}
function maketextalignstart(e) {
	e.style['text-align'] = 'start';
}
function setDirAutoAndTextAlignStartAndMakeRightToLeftIfHebrew(e) {
	try {
		if(isInnerTextHebrew(e)) {
			e.setAttribute('dir', 'rtl');
		}else{
			e.setAttribute('dir', 'auto');
			
		}
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
	} catch(err) {
		console.error('element that threw error: ', e, '\nerr:\n', err)
		debugger;
	}
}
function nestFromRight(e) {
	e.style.paddingLeft = undefined;
	e.style.paddingRight = "1.5em";
}
function nestedHebrewBlocks() {
	return [...document.querySelectorAll('[style*=padding-left]')]
		.filter(e => { try { return e.style.paddingLeft == "1.5em" && isInnerTextHebrew(e) } catch { return false } });
}
function selectableImageBlocks() {
	return document.querySelectorAll('.notion-selectable.notion-image-block')
}
const pageLoadInterval = setInterval(() => {
	if(_pageLoaded || hasPageLoaded()) {
		blocks().forEach(makedirauto);
		// setBlocksDirectionToAuto();
		listItems().forEach(maketextalignstart);
		// alignListItemsToRight();
		// document.querySelectorAll('[spellcheck=true]').forEach(setDirAutoAndTextAlignStartAndMakeRightToLeftIfHebrew);
		editableDivs().forEach(setDirAutoAndTextAlignStartAndMakeRightToLeftIfHebrew);
		// [...document.querySelectorAll('.notion-selectable')].forEach(selectable => {
		// 	[...selectable.children].forEach(setDirAutoAndTextAlignStartAndMakeRightToLeftIfHebrew)
		// });
		childrenOfSelectables().forEach(setDirAutoAndTextAlignStartAndMakeRightToLeftIfHebrew);
		selectableImageBlocks().forEach(maketextalignstart);
		nestedHebrewBlocks().forEach(nestFromRight)
		/* let titleblock = pageTitleBlock();
		let re = /[א-ת]+/.exec(titleblock.innerText);
		
		if(re[0] === re.input){
			// fullmatch
		} */



	}
}, 400)
console.log('inject.js')
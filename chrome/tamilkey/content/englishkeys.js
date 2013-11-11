var Tk_tamilMode = new Boolean();
var Tk_isPrevConsonant = new Boolean();
var Tk_isCtrl = new Boolean();
var Tk_myChar, Tk_prevChar, Tk_newText;
var Tk_isDispatchedEvent = new Boolean();
var Tk_isPrevVowel = new Boolean();
var Tk_isKeetruCondition = new Boolean();
var Tk_selKbrd = "english";

function Tk_englishkeyboard()
{
	Tk_tamilMode = !Tk_tamilMode;
	if(Tk_tamilMode)
		eval( "Tk_doFunc('"+Tk_selKbrd+"')");
	else
	{
		Tk_prevChar = "";
		Tk_ConverterLib.toggleEditor(Tk_handleKeyPressEnglish);
	}
	return;
}

function Tk_handleKeyPressEnglish(evt)
{
	// dummy do nothing.
	return;
}

function Tk_setMenus(kbrd)
{
	var tkPrefs = Components.classes["@mozilla.org/preferences-service;1"].getService(
				Components.interfaces.nsIPrefService).getBranch("extensions.tamilkey.");
	if(document.getElementById('englishkeys') != null )
	{
		document.getElementById('tamil99keys').setAttribute("checked","false");
		document.getElementById('anjalkeys').setAttribute("checked","false");
		document.getElementById('baminikeys').setAttribute("checked","false");
		document.getElementById('oldtwkeys').setAttribute("checked","false");
		document.getElementById('newtwkeys').setAttribute("checked","false");
		document.getElementById('inscriptkeys').setAttribute("checked","false");
		document.getElementById('avvaikeys').setAttribute("checked","false");
		document.getElementById('englishkeys').setAttribute("checked","false");
		tkPrefs.setBoolPref("showkb"+kbrd, true);
		document.getElementById(kbrd+'keys').setAttribute("checked","true");
	}
	if(document.getElementById('englishkeys_tb') != null )
	{
		document.getElementById('tamil99keys_tb').setAttribute("checked","false");
		document.getElementById('anjalkeys_tb').setAttribute("checked","false");
		document.getElementById('baminikeys_tb').setAttribute("checked","false");
		document.getElementById('oldtwkeys_tb').setAttribute("checked","false");
		document.getElementById('newtwkeys_tb').setAttribute("checked","false");
		document.getElementById('inscriptkeys_tb').setAttribute("checked","false");
		document.getElementById('avvaikeys_tb').setAttribute("checked","false");
		document.getElementById('englishkeys_tb').setAttribute("checked","false");
		tkPrefs.setBoolPref("showkb"+kbrd, true);
		document.getElementById(kbrd+'keys_tb').setAttribute("checked","true");
	}
}

function Tk_doFunc(kbrd)
{
	if(kbrd != "english")
		Tk_selKbrd = kbrd;
	Tk_setMenus(kbrd);
	eval ("Tk_"+kbrd+"keyboard()");
}

function Tk_doDel(e)
{
	if(!Tk_tamilMode)
		return;
	myField = e.target;
	if(myField.type)
	{
		var startPos = myField.selectionStart;
		var endPos = myField.selectionEnd;
		var txtTop = myField.scrollTop;
		var scrlLeft = myField.scrollLeft;
		var scrlWidth = myField.scrollWidth;
		if(endPos == startPos)
			endPos++;
		var prevStr = myField.value.substring(0,startPos);
		var nextChar =  myField.value.substring(startPos+1,startPos+2);
		if(Tk_isOtru(nextChar))
			endPos ++;
		myField.value = prevStr +  myField.value.substring(endPos, myField.value.length);
		if(scrlWidth != myField.scrollWidth)
			myField.scrollLeft += scrlLeft + myField.scrollWidth - scrlWidth;
		if((myField.scrollHeight+4)+"px" != myField.style.height)
			myField.scrollTop = txtTop;

		if(e.target.id != 'urlbar' )
		{
			myField.selectionStart = startPos;
			myField.selectionEnd = startPos;
		}
		e.stopPropagation();
		e.preventDefault();
	}
}

function Tk_doBS(e)
{
	if(!Tk_tamilMode)
		return;
	myField = e.target;
	if(myField.type)
	{
		var startPos = myField.selectionStart;
		var endPos = myField.selectionEnd;
		var txtTop = myField.scrollTop;
		var scrlLeft = myField.scrollLeft;
		var scrlWidth = myField.scrollWidth;
		if(endPos == startPos)
			startPos--;
		var delChar =  myField.value.substring(startPos,startPos+1);
		if(Tk_isOtru(delChar))
			startPos--;
		var prevStr = myField.value.substring(0,startPos);
		myField.value = prevStr +  myField.value.substring(endPos, myField.value.length);
		if(scrlWidth != myField.scrollWidth)
			myField.scrollLeft += scrlLeft + myField.scrollWidth - scrlWidth;
		if((myField.scrollHeight+4)+"px" != myField.style.height)
			myField.scrollTop = txtTop;

		if(e.target.id != 'urlbar' )
		{
			myField.selectionStart = startPos;
			myField.selectionEnd = startPos;
		}
		Tk_isPrevConsonant = false;
		Tk_isPrevVowel = false;
		Tk_isKeetruCondition = false;
		Tk_prevChar = "";
		e.stopPropagation();
		e.preventDefault();
	}
}


function Tk_isOtru(char)
{
	if(char.charCodeAt(0) == 2946 || ( char.charCodeAt(0) >= 3006 && char.charCodeAt(0) <= 3021) )
		return true;
	else
		return false;
}

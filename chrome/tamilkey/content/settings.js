/* Strip whitespace from the beginning and end of a string */
if (typeof String.prototype.trim == "undefined") {
    String.prototype.trim = function () {
        var s = this.replace(/^\s*/, "");
        return s.replace(/\s*$/, "");
    }
}

if (typeof String.prototype.reverse == "undefined") {
	String.prototype.reverse = function(){
		splitext = this.split("");
		revertext = splitext.reverse();
		reversed = revertext.join("");
		return reversed;
	}
}

if (typeof String.prototype.initCaps == "undefined") {
    String.prototype.initCaps = function () {
        return this.substring(0,1).toUpperCase()+ this.substring(1,this.length);
    }
}



var tkprf = new Array();
tkprf["extensions.tamilkey.avvaishortcut"] = "Alt+F6";
tkprf["extensions.tamilkey.inscriptshortcut"] = "Alt+F7";
tkprf["extensions.tamilkey.anjalshortcut"] = "Alt+F8";
tkprf["extensions.tamilkey.tamil99shortcut"] = "Alt+F9";
tkprf["extensions.tamilkey.baminishortcut"] = "Alt+F10";
tkprf["extensions.tamilkey.oldtwshortcut"] = "Alt+F11";
tkprf["extensions.tamilkey.newtwshortcut"] = "Alt+F12";
tkprf["extensions.tamilkey.englishshortcut"] = "F9";

function Tk_populateURLList()
{
	if(navigator.userAgent.indexOf("Thunderbird") >= 0)
	{
		document.getElementById("selurlgrp").hidden = true;
		return;
	}
	var tkPrefs = Components.classes["@mozilla.org/preferences-service;1"].getService(
					Components.interfaces.nsIPrefService).getBranch("extensions.tamilkey.");
	var urllist = tkPrefs.getCharPref("selecturls").split(";");
	if(urllist[0] == "") return;
	selectlist = document.getElementById("selectlist");
	for(i=0;i<urllist.length;i++)
	{
		listitem = document.createElement("listitem");
		listcellURL = document.createElement("listcell");
		listcellKbrd = document.createElement("listcell");
		kbrdlist = document.getElementById("selectkeybrd").childNodes[0].childNodes;
		kbrdvalue = urllist[i].split(",")[1];
		kbrdlabel = kbrdlist[ urllist[i].split(",")[1] ].label;
		listcellURL.setAttribute("label", urllist[i].split(",")[0]);
		listcellKbrd.setAttribute("label",kbrdlabel);
		listcellKbrd.setAttribute("value",kbrdvalue);
		listitem.appendChild(listcellURL);
		listitem.appendChild(listcellKbrd);
		selectlist.appendChild(listitem);
	}
}

function Tk_setDefaultKbrdMaps()
{
	if(navigator.userAgent.indexOf("Thunderbird") >= 0)
	{
		window.addEventListener("click",Tk_AutoKbrd,false);
		return;
	}
	var tkPrefs = Components.classes["@mozilla.org/preferences-service;1"].getService(
					Components.interfaces.nsIPrefService).getBranch("extensions.tamilkey.");
	var urllist = tkPrefs.getCharPref("selecturls").split(";");
	if(urllist[0] == "")
	{
		window.addEventListener("click",Tk_AutoKbrd,false);
		return;
	}
	var retArr = new Array();
	myConvArr = new Array("anjal","tamil99","bamini","newtw","oldtw","inscript","avvai");
	for(i=0;i<urllist.length;i++)
		if(content.location.href.indexOf(urllist[i].split(",")[0]) >= 0 )
		{
			Tk_selKbrd = myConvArr[ urllist[i].split(",")[1] ]
			Tk_tamilMode = true;
			tkPrefs.setBoolPref("showkb"+Tk_selKbrd, true);
		}
	window.addEventListener("click",Tk_AutoKbrd,false);
}

function Tk_AutoKbrd(evt)
{

	CurrentNode = Tk_ConverterLib.getNode();
	if(CurrentNode.node == null) return;
	mfunc = eval( "Tk_handleKeyPress"+Tk_selKbrd.initCaps());
	Tk_myChar = "";
	Tk_prevChar = "";
	Tk_newText = "";
	Tk_ConverterLib.toggleEditor(mfunc)
}


function Tk_saveURLList()
{
	var tkPrefs = Components.classes["@mozilla.org/preferences-service;1"].getService(
					Components.interfaces.nsIPrefService).getBranch("extensions.tamilkey.");
	selectlist = document.getElementById("selectlist");
	var prefString = "";

	for (var i=2; i < selectlist.childNodes.length; i++)
	{
		var columns = selectlist.childNodes[i].childNodes;
		var str = columns[0].getAttribute("label") + ","
		    + columns[1].getAttribute("value") ;
		if(prefString == "")
			prefString = str;
		else
			prefString += ";" + str;
	}
	var str = Components.classes["@mozilla.org/supports-string;1"]
      .createInstance(Components.interfaces.nsISupportsString);
	tkPrefs.setCharPref("selecturls",prefString);
	selectlist.setAttribute("tamilkey.attribute.modified","no");
}

function Tk_unloadAlert(evt)
{
	if( avvaishortcut.keyData.modified  || inscriptshortcut.keyData.modified || anjalshortcut.keyData.modified || baminishortcut.keyData.modified ||
		tamil99shortcut.keyData.modified || oldtwshortcut.keyData.modified ||
		newtwshortcut.keyData.modified || englishshortcut.keyData.modified
		)
			alert('\u0BA4\u0BC6\u0BB0\u0BBF\u0BB5\u0BC1\u0B95\u0BB3\u0BC8 '
				+'\u0BAE\u0BBE\u0BB1\u0BCD\u0BB1\u0BBF\u0BAF \u0BAA\u0BBF\u0BA9\u0BCD '
				+'\u0B9A\u0BC6\u0BAF\u0BB2\u0BBF\u0BAF\u0BC8 \u0BAE\u0BC2\u0B9F\u0BBF '
				+'\u0BAE\u0BB1\u0BC1\u0BA4\u0BC1\u0BB5\u0B95\u0BCD\u0B95\u0BAE\u0BCD '
				+'\u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BB5\u0BC1\u0BAE\u0BCD.');

	if(selectlist != null && selectlist.getAttribute("tamilkey.attribute.modified") == "yes")
			Tk_saveURLList();
}

function Tk_setAccessKeys()
{
	var tkPrefs = Components.classes["@mozilla.org/preferences-service;1"].getService(
					Components.interfaces.nsIPrefService).getBranch("extensions.tamilkey.");
	Tk_setAccKey("avvai",tkPrefs);
	Tk_setAccKey("inscript",tkPrefs);
	Tk_setAccKey("anjal",tkPrefs);
	Tk_setAccKey("tamil99",tkPrefs);
	Tk_setAccKey("bamini",tkPrefs);
	Tk_setAccKey("oldtw",tkPrefs);
	Tk_setAccKey("newtw",tkPrefs);
	Tk_setAccKey("english",tkPrefs);
	var menu = document.getElementById("contentAreaContextMenu");
	var tbmenu =  document.getElementById("msgComposeContext");
	if(menu != null)
  		menu.addEventListener("popupshowing", Tk_contextPopupShowing, false);
	if(tbmenu != null)
  		tbmenu.addEventListener("popupshowing", Tk_contextPopupShowing, false);
}

function Tk_contextPopupShowing(evt)
{

	var tkPrefs = Components.classes["@mozilla.org/preferences-service;1"].getService(
				Components.interfaces.nsIPrefService).getBranch("extensions.tamilkey.");
	CurrentNode = Tk_ConverterLib.getNode();
	var menu = document.getElementById("tamilkey_menu");
	var tbmenu =  document.getElementById("tamilkey_menu_tb");
	if(menu != null)
	{
		menu.hidden = (CurrentNode.node == null);
		var anjalkeys = document.getElementById("anjalkeys");
		anjalkeys.hidden = !tkPrefs.getBoolPref("showkbanjal");
		var tamil99keys = document.getElementById("tamil99keys");
		tamil99keys.hidden = !tkPrefs.getBoolPref("showkbtamil99");
		var baminikeys = document.getElementById("baminikeys");
		baminikeys.hidden = !tkPrefs.getBoolPref("showkbbamini");
		var oldtwkeys = document.getElementById("oldtwkeys");
		oldtwkeys.hidden = !tkPrefs.getBoolPref("showkboldtw");
		var newtwkeys = document.getElementById("newtwkeys");
		newtwkeys.hidden = !tkPrefs.getBoolPref("showkbnewtw");
		var avvaikeys = document.getElementById("avvaikeys");
		avvaikeys.hidden  = !tkPrefs.getBoolPref("showkbavvai");
		var inscriptkeys = document.getElementById("inscriptkeys");
		inscriptkeys.hidden  = !tkPrefs.getBoolPref("showkbinscript");
		var englishkeys = document.getElementById("englishkeys");
		englishkeys.hidden = !tkPrefs.getBoolPref("showkbenglish");
	}
	if(tbmenu != null)
	{
		tbmenu.hidden = (CurrentNode.node == null);
		var anjalkeys = document.getElementById("anjalkeys_tb");
		anjalkeys.hidden = !tkPrefs.getBoolPref("showkbanjal");
		var tamil99keys = document.getElementById("tamil99keys_tb");
		tamil99keys.hidden = !tkPrefs.getBoolPref("showkbtamil99");
		var baminikeys = document.getElementById("baminikeys_tb");
		baminikeys.hidden = !tkPrefs.getBoolPref("showkbbamini");
		var oldtwkeys = document.getElementById("oldtwkeys_tb");
		oldtwkeys.hidden = !tkPrefs.getBoolPref("showkboldtw");
		var newtwkeys = document.getElementById("newtwkeys_tb");
		newtwkeys.hidden = !tkPrefs.getBoolPref("showkbnewtw");
		var avvaikeys = document.getElementById("avvaikeys_tb");
		avvaikeys.hidden  = !tkPrefs.getBoolPref("showkbavvai");
		var inscriptkeys = document.getElementById("inscriptkeys_tb");
		inscriptkeys.hidden  = !tkPrefs.getBoolPref("showkbinscript");
		var englishkeys = document.getElementById("englishkeys_tb");
		englishkeys.hidden = !tkPrefs.getBoolPref("showkbenglish");
	}
}

function Tk_addURL(aNode)
{

	selectkeybrd = document.getElementById('selectkeybrd');
	selecturl = document.getElementById('selecturl');
	if(Tk_ValidateURL(selecturl))
	{
		listitem = document.createElement("listitem");
		listcellURL = document.createElement("listcell");
		listcellKbrd = document.createElement("listcell");
		listcellURL.setAttribute("label", selecturl.value.trim());
		listcellKbrd.setAttribute("label",selectkeybrd.label);
		listcellKbrd.setAttribute("value",selectkeybrd.value);
		listitem.appendChild(listcellURL);
		listitem.appendChild(listcellKbrd);
		aNode.appendChild(listitem);
		selecturl.value = "";
		selecturl.focus();
		selectlist.setAttribute("tamilkey.attribute.modified","yes");
		aNode.selectedIndex = -1;
	}
	else
		alert("\u0B9A\u0BC1\u0B9F\u0BCD\u0B9F\u0BBF \u0B9A\u0BC6\u0BB2\u0BCD\u0BB2\u0BBE\u0BA4\u0BC1");
}

function Tk_delURL(aNode)
{
	if(aNode.selectedIndex < 0)
		alert("\u0BA8\u0BC0\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BBF\u0BAF \u0B9A\u0BC1\u0B9F\u0BCD\u0B9F\u0BBF\u0BAF\u0BC8 \u0BA4\u0BC7\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4\u0BC6\u0B9F\u0BC1\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD.")
	else
	{
		aNode.removeItemAt(aNode.selectedIndex);
		selectlist.setAttribute("tamilkey.attribute.modified","yes");
		selecturl = document.getElementById('selecturl');
		selecturl.value = "";
		selecturl.focus();
	}
}

function Tk_edtURL(aNode)
{
	if(aNode.selectedIndex == -1) return;
	selectkeybrd = document.getElementById('selectkeybrd');
	selecturl = document.getElementById('selecturl');
	selecturl.value = aNode.getItemAtIndex(aNode.selectedIndex).firstChild.getAttribute("label");
	selectkeybrd.setAttribute("label",aNode.getItemAtIndex(aNode.selectedIndex).lastChild.getAttribute("label"))
}

function Tk_ValidateURL(surl)
{
	if(surl.value.trim() == "" || surl.value.trim().indexOf(".") == -1)
		return false;
	else
	return true;
}

function Tk_setAccKey(kbrd,tkPrefs)
{
	if(tkPrefs.prefHasUserValue(kbrd+"shortcut"))
	{
		var ukey = document.getElementById(kbrd)
		if(ukey == null)
			ukey = document.getElementById(kbrd+"_tb");
		if(ukey == null)
			ukey = document.getElementById(kbrd+"_cz");
		var keypref = Tk_parseShortcut(tkPrefs.getCharPref(kbrd+"shortcut"));
		var keycode = keypref.keyCode;
		var key = keypref.key;
		var modifiers = [];
		if(keypref.altKey) modifiers.push("alt");
		if(keypref.ctrlKey) modifiers.push("control");
		if(keypref.metaKey) modifiers.push("meta");
		if(keypref.shiftKey) modifiers.push("shift");
		modifiers = modifiers.join(" ");
		ukey.removeAttribute('key');
		ukey.removeAttribute('keycode');
		ukey.removeAttribute('modifiers');
		if(key != '') ukey.setAttribute('key', key);
		if(keycode != '') ukey.setAttribute('keycode', keycode);
		ukey.setAttribute('modifiers', modifiers);
	}
}

function Tk_setShortcut(aNode)
{
		window.openDialog(
			'chrome://tamilkey/content/keyDetecter.xul',
			'_blank',
			'chrome,modal,resizable=no,titlebar=no,centerscreen',
			aNode.keyData,
			document.getElementById('dialogMessage').getAttribute('dialogMessage'),
			document.getElementById('dialogMessage').getAttribute('dialogButton')
		);
		if (aNode.keyData.modified) {
			aNode.value = aNode.keyData.string;
			var event = document.createEvent('UIEvents');
			event.initUIEvent('input', true, false, window, 0);
			aNode.dispatchEvent(event);
		}
}

function Tk_clearShortcut(aNode)
{
	aNode.value = tkprf["extensions.tamilkey."+aNode.id];
	aNode.keyData = Tk_parseShortcut(aNode.value);
	aNode.keyData.modified = true;

	var event = document.createEvent('UIEvents');
	event.initUIEvent('input', true, false, window, 0);
	aNode.dispatchEvent(event);
}

function Tk_parseShortcut(aShortcut)
{
	var keys = aShortcut.split('+');
	var keyCode = keys[keys.length-1].replace(/ /g, '_').toUpperCase();

	var key = keyCode;
	keyCode = (keyCode.length == 1 ) ? '' : 'VK_'+keyCode ;
	key = (keyCode != '') ? '' : key;
	return {
		key      : key,
		charCode : (key ? key.charCodeAt(0) : '' ),
		keyCode  : keyCode,
		altKey   : /alt/i.test(aShortcut),
		ctrlKey  : /ctrl|control/i.test(aShortcut),
		metaKey  : /meta/i.test(aShortcut),
		shiftKey : /shift/i.test(aShortcut),
		string   : aShortcut,
		modified : false
	};
}

var tamil99shortcut,avvaishortcut,inscriptshortcut,anjalshortcut,baminishortcut,oldtwshortcut;
var newtwshortcut,selectlist,englishshortcut;

function Tk_setHotKeyVals()
{
	avvaishortcut = document.getElementById('avvaishortcut');
	avvaishortcut.keyData = Tk_parseShortcut(avvaishortcut.value);
	inscriptshortcut = document.getElementById('inscriptshortcut');
	inscriptshortcut.keyData = Tk_parseShortcut(inscriptshortcut.value);
	tamil99shortcut = document.getElementById('tamil99shortcut');
	tamil99shortcut.keyData = Tk_parseShortcut(tamil99shortcut.value);
	anjalshortcut = document.getElementById('anjalshortcut');
	anjalshortcut.keyData = Tk_parseShortcut(anjalshortcut.value);
	baminishortcut = document.getElementById('baminishortcut');
	baminishortcut.keyData = Tk_parseShortcut(baminishortcut.value);
	oldtwshortcut = document.getElementById('oldtwshortcut');
	oldtwshortcut.keyData = Tk_parseShortcut(oldtwshortcut.value);
	newtwshortcut = document.getElementById('newtwshortcut');
	newtwshortcut.keyData = Tk_parseShortcut(newtwshortcut.value);
	englishshortcut = document.getElementById('englishshortcut');
	englishshortcut.keyData = Tk_parseShortcut(englishshortcut.value);
	selectlist = document.getElementById('selectlist');
	selectlist.setAttribute("tamilkey.attribute.modified","no");
}

function Tk_HandleEnterKey(evt)
{
	if(evt.which == 13)
	{
		evt.preventDefault();
		evt.stopPropagation();
		Tk_addURL(selectlist);
	}
	else
		return true;
}

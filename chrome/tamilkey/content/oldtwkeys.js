function Tk_oldtwkeyboard()
{
Tk_tamilMode = true;
Tk_prevChar = "";
Tk_oldPrevChar = "";
Tk_ConverterLib.toggleEditor(Tk_handleKeyPressOldtw);
return;
}

function Tk_handleKeyPressOldtw(evt)
{
	if(!evt.cancelable) // oldtw char -> don't process
		return;
	if(evt.keyCode >= 33 && evt.keyCode <= 40) // handle cursor moves
	{
		Tk_oldPrevChar = Tk_prevChar;
		Tk_prevChar = "";
		return;
	}
	else if(evt.keyCode == 46) // handle delete
	{
		Tk_doDel(evt);
		return;
	}
	else if(evt.keyCode == 8 || evt.keyCode == 13 ) // handle backspace
	{
		Tk_oldPrevChar = Tk_prevChar;
		Tk_prevChar = "";
		if(evt.keyCode == 8)
			Tk_doBS(evt);
		else
			Tk_prevChar = "\n";
		return;
	}
	if (evt.charCode && Tk_tamilMode && !evt.ctrlKey)
	{
		if (evt.charCode > 255)
			return; // dont capture tamil events
		Tk_myChar = String.fromCharCode(evt.charCode);
		Tk_myTChar = Tk_getOldTwChar(Tk_myChar);
		var editor =  (document.commandDispatcher.focusedElement instanceof
						Components.interfaces.nsIDOMNSEditableElement) ?
						document.commandDispatcher.focusedElement.editor : null
		if(editor)
		{
			var myField = evt.target;
			Tk_prevChar = myField.value.substring(myField.selectionStart - 1, myField.selectionStart);
			var prevStr = myField.value.substring(0,myField.selectionStart - 1);
			var postStr = myField.value.substring(myField.selectionEnd,myField.value.length);

			//remove the zero width non joiner and reverse the otru
			if( Tk_prevChar != "" && Tk_isOLKombuPulli(Tk_prevChar) && Tk_oldPrevChar.indexOf("\u200C") != -1 )
			{
				Tk_myTChar = Tk_myTChar.reverse();
				prevStr = prevStr.replace("\u200C","");
			}

			var len = prevStr.length ;
			var sPos = myField.selectionEnd ;
			var charAdded = myField.value.length;
			var txtTop = myField.scrollTop;

			if (evt.target.type != "text" && evt.target.type != "textarea" )
			{
				prevStr = myField.value;
				len = prevStr.length ;
				postStr = "";
			}
			if(Tk_myTChar != Tk_myChar)
				myField.value = prevStr + Tk_myTChar + postStr;
			else
				myField.value = prevStr + Tk_prevChar + Tk_myTChar + postStr ;

			evt.stopPropagation();
			evt.preventDefault();
			charAdded = myField.value.length - charAdded;
			myField.scrollTop = txtTop;

			if(evt.target.id != 'urlbar' )
			{
				myField.selectionStart = sPos + charAdded;
				myField.selectionEnd = sPos + charAdded;
			}
			if( Tk_myTChar.length >= 2)
				Tk_oldPrevChar = Tk_myTChar.substring(Tk_myTChar.length - 2, Tk_myTChar.length - 1)
			else
				Tk_oldPrevChar = Tk_prevChar;
			Tk_prevChar = Tk_myTChar.substring(Tk_myTChar.length - 1, Tk_myTChar.length);
		}
		else
		{
			if(Tk_myTChar != (Tk_prevChar + Tk_myChar))
			{
				var i = 0;
				//remove the zero width non joiner and reverse the otru
				if( Tk_prevChar != "")
				{
					if(Tk_isOLKombuPulli(Tk_prevChar) && Tk_oldPrevChar.indexOf("\u200C") != -1)
					{
						Tk_myTChar = Tk_myTChar.reverse();
						var evnt = window.document.createEvent("KeyEvents");
						evnt.initKeyEvent("keypress", true, true, window.document.defaultView, evt.ctrlKey, evt.altKey, evt.shiftKey, evt.metaKey, 8, 0);
						evt.target.dispatchEvent(evnt);
					}
					var evnt = window.document.createEvent("KeyEvents");
					evnt.initKeyEvent("keypress", true, true, window.document.defaultView, evt.ctrlKey, evt.altKey, evt.shiftKey, evt.metaKey, 8, 0);
					evt.target.dispatchEvent(evnt);
				}

				if( Tk_myTChar.length >= 2)
					Tk_oldPrevChar = Tk_myTChar.substring(Tk_myTChar.length - 2, Tk_myTChar.length - 1)
				else
					Tk_oldPrevChar = Tk_prevChar;

				while(i < Tk_myTChar.length)
				{
					var Tk_prevCharCode = Tk_myTChar.charCodeAt(i);
					Tk_prevChar = String.fromCharCode(Tk_prevCharCode);
					var evnt = window.document.createEvent("KeyEvents");
					evnt.initKeyEvent("keypress", true, false, window.document.defaultView, evt.ctrlKey, evt.altKey, evt.shiftKey, evt.metaKey, 0, Tk_prevCharCode);
					evt.target.dispatchEvent(evnt);
					i++;
				}
				evt.stopPropagation();
				evt.preventDefault();
			}
			else
			{
				if( Tk_myTChar.length >= 2)
					Tk_oldPrevChar = Tk_myTChar.substring(Tk_myTChar.length - 2, Tk_myTChar.length - 1)
				else
					Tk_oldPrevChar = Tk_prevChar;
				Tk_prevChar = Tk_myTChar.substring(Tk_myTChar.length -1, Tk_myTChar.length);
			}
		}
	}
	else
		return;
}

function Tk_isOLKombuPulli(prevletter)
{
	if( prevletter == "\u0BCD"  //pulli
		|| prevletter == "\u0BBF" //i kombu
		|| prevletter == "\u0BC0" //I kombu
		|| prevletter == "\u0BC1" //u kombu
		|| prevletter == "\u0BC2" //U kombu
		|| prevletter == "\u0BC6" //e kombu
		|| prevletter == "\u0BC7" //E kombu
		|| prevletter == "\u0BC8" //ai kombu
		 )
			return true;
	else
		return false;
}

function Tk_getOldTwChar(letter)
{
var otwCh = new Array();
otwCh['!'] = "\u0BB8";
otwCh['$'] = "\u0B9C";
otwCh['%'] = "\u0BC1";
otwCh['^'] = "\u0BC2";
otwCh['&'] = "\u0BB7";
otwCh['_'] = "\u0BB8\u0BCD\u0BB0\u0BC0";
otwCh['*'] = "";
otwCh['+'] = "";
otwCh['q'] = "\u0BA3\u0BC1";
otwCh['w'] = "\u0BB1";
otwCh['e'] = "\u0BA8";
otwCh['r'] = "\u0B9A";
otwCh['t'] = "\u0BB5";
otwCh['y'] = "\u0BB2";
otwCh['u'] = "\u0BB0";
otwCh['i'] = "\u0BC8";
otwCh['o'] = "\u0B9F\u0BBF";
otwCh['p'] = "\u0BBF";
otwCh['['] = "\u0BC1";
otwCh[']'] = "\u0B94";
otwCh["\\"] = "\u0B95\u0BCD\u0BB7";
otwCh['Q'] = "\u0B9E\u0BC1";
otwCh['W'] = "\u0BB1\u0BC1";
otwCh['E'] = "\u0BA8\u0BC1";
otwCh['R'] = "\u0B9A\u0BC1";
otwCh['T'] = "\u0B95\u0BC2";
otwCh['Y'] = "\u0BB2\u0BC1";
otwCh['U'] = "\u0BB0\u0BC1";
otwCh['I'] = "\u0B90";
otwCh['O'] = "\u0B9F\u0BC0";
otwCh['P'] = "\u0BC0";
otwCh['{'] = "\u0BC2";
otwCh['}'] = "\u0BC2";

otwCh['a'] = "\u0BAF";
otwCh['s'] = "\u0BB3";
otwCh['d'] = "\u0BA9";
otwCh['f'] = "\u0B95";
otwCh['g'] = "\u0BAA";
otwCh['h'] = "\u0BBE";
otwCh['j'] = "\u0BA4";
otwCh['k'] = "\u0BAE";
otwCh['l'] = "\u0B9F";
otwCh[';'] = "\u0BCD";
otwCh['\''] = "\u0B99";
otwCh['A'] = "\u0BB1\u0BBE";
otwCh['S'] = "\u0BB3\u0BC1";
otwCh['D'] = "\u0BA9\u0BC1";
otwCh['F'] = "\u0B95\u0BC1";
otwCh['G'] = "\u0BB4\u0BC1";
otwCh['H'] = "\u0BB4";
otwCh['J'] = "\u0BA4\u0BC1";
otwCh['K'] = "\u0BAE\u0BC1";
otwCh['L'] = "\u0B9F\u0BC1";
otwCh[':'] = "\u00B0";
otwCh['"'] = "\u0B9E";

otwCh['z'] = "\u0BA3";
otwCh['x'] = "\u0B92";
otwCh['c'] = "\u0B89";
otwCh['v'] = "\u0B8E";
otwCh['b'] = "\u0BC6";
otwCh['n'] = "\u0BC7";
otwCh['m'] = "\u0B85";
otwCh[','] = "\u0B87";
otwCh['Z'] = "\u0BB9";
otwCh['X'] = "\u0B93";
otwCh['C'] = "\u0B8A";
otwCh['V'] = "\u0B8F";
otwCh['B'] = "\u0B83";
otwCh['N'] = "\u0B9A\u0BC2";
otwCh['M'] = "\u0B86";
otwCh['<'] = "\u0B88";

otwCh['|'] = "!";
otwCh['`'] = "&";
otwCh['.'] = ",";
otwCh['/'] = ".";
otwCh['#'] = "%";
otwCh['~'] = ";";
otwCh['-'] = "/";
otwCh['@'] = "\"";
otwCh['>'] = "-";

if(otwCh[letter])
{
	if(Tk_isOLKombuPulli(otwCh[letter]))
		otwCh[letter] = "\u200C"+otwCh[letter];
	if(Tk_prevChar == "\u0BC1" && (otwCh[letter] == "\u0BBE"  || otwCh[letter] == "\u200C\u0BC2") )
		return "\u200C\u0BC2";
	else if(Tk_prevChar == "\u00B0" && (otwCh[letter] == "\u0BAE" || otwCh[letter].indexOf("\u0BC1") == 1 ) )
		return otwCh[letter].substring(0,1)+"\u0BC2";
	else if (Tk_prevChar == "\u0BC6" && otwCh[letter] == "\u0BBE")
		return "\u0BCA";
	else if (Tk_oldPrevChar != "\u200C" && Tk_prevChar == "\u0BC6" && otwCh[letter] == "\u0BB3")
		return "\u0BCC";
	else if(Tk_prevChar == "\u0BCC" && otwCh[letter] == "\u0BBE")
		return "\u0BC6\u0BB3"+otwCh[letter];
	else if(Tk_prevChar == "\u0B94" && otwCh[letter] == "\u0BBE" )
		return "\u0B92\u0BB3"+otwCh[letter];
	else if (Tk_prevChar == "\u0BC7" && otwCh[letter] == "\u0BBE")
		return "\u0BCB";
	else if(Tk_prevChar == "\u0B92" && otwCh[letter] == "\u0BB3")
		return "\u0B94";
	else
		return Tk_prevChar + otwCh[letter];
}
else
	return Tk_prevChar+letter;
}

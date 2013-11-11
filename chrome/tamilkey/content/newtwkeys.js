function Tk_newtwkeyboard()
{
Tk_tamilMode = true;
Tk_prevChar = "";
Tk_oldPrevChar = "";
Tk_ConverterLib.toggleEditor(Tk_handleKeyPressNewtw);
return;
}

function Tk_handleKeyPressNewtw(evt)
{
	if(!evt.cancelable) // newtw char -> don't process
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
		Tk_myTChar = Tk_getNewTwChar(Tk_myChar);
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
			if( Tk_prevChar != "" && Tk_isNWKombuPulli(Tk_prevChar) && Tk_oldPrevChar.indexOf("\u200C") != -1 )
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
					if(Tk_isNWKombuPulli(Tk_prevChar) &&  Tk_prevChar != Tk_oldPrevChar)
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

function Tk_isNWKombuPulli(prevletter,currletter)
{
	if(prevletter == "\u0BC6" //e kombu
		|| prevletter == "\u0BC7" //E kombu
		|| prevletter == "\u0BC8" //ai kombu
		)
			return true;
	else
		return false;
}

function Tk_getNewTwChar(letter)
{
var ntwCh = new Array();
ntwCh['!'] = "!";
ntwCh['$'] = "\u0B9C";
ntwCh['%'] = "\u0BC1";
ntwCh['^'] = "\u0BC2";
ntwCh['&'] = "\u0BB7";
ntwCh['_'] = "\u0BB8\u0BCD\u0BB0\u0BC0";
ntwCh['*'] = "'";
ntwCh['+'] = "\u0BB9";
ntwCh['q'] = "\u0BA3\u0BC1";
ntwCh['w'] = "\u0BB1";
ntwCh['e'] = "\u0BA8";
ntwCh['r'] = "\u0B9A";
ntwCh['t'] = "\u0BB5";
ntwCh['y'] = "\u0BB2";
ntwCh['u'] = "\u0BB0";
ntwCh['i'] = "\u0BC8";
ntwCh['o'] = "\u0B9F\u0BBF";
ntwCh['p'] = "\u0BBF";
ntwCh['['] = "\u0BC1";
ntwCh[']'] = "\u0BC1";
ntwCh["\\"] = "\\";
ntwCh['Q'] = "";
ntwCh['W'] = "\u0BB1\u0BC1";
ntwCh['E'] = "\u0BA8\u0BC1";
ntwCh['R'] = "\u0B9A\u0BC1";
ntwCh['T'] = "\u0B95\u0BC2";
ntwCh['Y'] = "\u0BB2\u0BC1";
ntwCh['U'] = "\u0BB0\u0BC1";
ntwCh['I'] = "\u0B90";
ntwCh['O'] = "\u0B9F\u0BC0";
ntwCh['P'] = "\u0BC0";
ntwCh['{'] = "\u0BC2";
ntwCh['}'] = "\u0BC2";

ntwCh['a'] = "\u0BAF";
ntwCh['s'] = "\u0BB3";
ntwCh['d'] = "\u0BA9";
ntwCh['f'] = "\u0B95";
ntwCh['g'] = "\u0BAA";
ntwCh['h'] = "\u0BBE";
ntwCh['j'] = "\u0BA4";
ntwCh['k'] = "\u0BAE";
ntwCh['l'] = "\u0B9F";
ntwCh[';'] = "\u0BCD";
ntwCh['\''] = "\u0B99";
ntwCh['A'] = "";
ntwCh['S'] = "\u0BB3\u0BC1";
ntwCh['D'] = "\u0BA9\u0BC1";
ntwCh['F'] = "\u0B95\u0BC1";
ntwCh['G'] = "\u0BB4\u0BC1";
ntwCh['H'] = "\u0BB4";
ntwCh['J'] = "\u0BA4\u0BC1";
ntwCh['K'] = "\u0BAE\u0BC1";
ntwCh['L'] = "\u0B9F\u0BC1";
ntwCh[':'] = "\u0BC2";
ntwCh['"'] = "\u0B9E";

ntwCh['z'] = "\u0BA3";
ntwCh['x'] = "\u0B92";
ntwCh['c'] = "\u0B89";
ntwCh['v'] = "\u0B8E";
ntwCh['b'] = "\u0BC6";
ntwCh['n'] = "\u0BC7";
ntwCh['m'] = "\u0B85";
ntwCh[','] = ",";
ntwCh['Z'] = "";
ntwCh['X'] = "\u0B93";
ntwCh['C'] = "\u0B8A";
ntwCh['V'] = "\u0B8F";
ntwCh['B'] = "";
ntwCh['N'] = "\u0B9A\u0BC2";
ntwCh['M'] = "\u0B86";
ntwCh['<'] = "\u0B88";



ntwCh['|'] = "\u0BB8";
ntwCh['`'] = "\u0B83";
ntwCh['.'] = ".";
ntwCh['/'] = "\u0B87";
ntwCh['#'] = "\u0B95\u0BCD\u0BB7";
ntwCh['~'] = "*";
ntwCh['-'] = "/";
ntwCh['@'] = "";
ntwCh['>'] = "-";

if(ntwCh[letter])
{
	if(Tk_isNWKombuPulli(ntwCh[letter]))
		ntwCh[letter] = "\u200C"+ntwCh[letter];
	if(Tk_prevChar == "\u0BC1" && (ntwCh[letter] == "\u0BBE"  || ntwCh[letter] == "\u0BC2") )
		return "\u0BC2";
	else if (Tk_prevChar == "\u0BC6" && ntwCh[letter] == "\u0BBE")
		return "\u0BCA";
	else if (Tk_oldPrevChar != "\u200C" && Tk_prevChar == "\u0BC6" && ntwCh[letter] == "\u0BB3")
		return "\u0BCC";
	else if (Tk_prevChar == "\u0BC7" && ntwCh[letter] == "\u0BBE")
		return "\u0BCB";
	else if(Tk_prevChar == "\u0B92" && ntwCh[letter] == "\u0BB3")
		return "\u0B94";
	else if(Tk_prevChar == "\u0BCC" && ( ntwCh[letter] == "\u0BBE" ||
			ntwCh[letter] == "\u0BBF" || ntwCh[letter] == "\u0BC0" ||
			ntwCh[letter] == "\u0BC1" || ntwCh[letter] == "\u0BC2" ||
			ntwCh[letter] == "\u0BCD") )
		return "\u0BC6\u0BB3"+ntwCh[letter];
	else if(Tk_prevChar == "\u0B94" && ( ntwCh[letter] == "\u0BBE" ||
			ntwCh[letter] == "\u0BBF" || ntwCh[letter] == "\u0BC0" ||
			ntwCh[letter] == "\u0BC1" || ntwCh[letter] == "\u0BC2" ||
			ntwCh[letter] == "\u0BCD") )
		return "\u0B92\u0BB3"+ntwCh[letter];
	else
		return Tk_prevChar + ntwCh[letter];
}
else
	return Tk_prevChar+letter;
}

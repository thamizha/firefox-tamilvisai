function Tk_avvaikeyboard()
{
Tk_tamilMode = true;
Tk_prevChar = "";
Tk_oldPrevChar = "";
Tk_ConverterLib.toggleEditor(Tk_handleKeyPressAvvai);
return;
}

function Tk_handleKeyPressAvvai(evt)
{
	if(!evt.cancelable) // avvai char -> don't process
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
		Tk_myTChar = Tk_getAvvaiChar(Tk_myChar);
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
			if( Tk_prevChar != "" && Tk_isAVKombuPulli(Tk_prevChar) && Tk_oldPrevChar.indexOf("\u200C") != -1 )
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
					if(Tk_isAVKombuPulli(Tk_prevChar) && Tk_oldPrevChar.indexOf("\u200C") != -1)
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

function Tk_isAVKombuPulli(prevletter)
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

function Tk_getAvvaiChar(letter)
{
var avvCh = new Array();
avvCh['Q'] = "\u0BB8";
avvCh['I'] = "\u0B90";
avvCh['P'] = "\u0BC0";
avvCh['{'] = "\u0BB8\u0BCD\u0BB0\u0BC0";
avvCh['}'] = " \u0B83";

avvCh['w'] = "\u0BB1";
avvCh['e'] = "\u0BA8";
avvCh['r'] = "\u0B9A";
avvCh['t'] = "\u0BB5";
avvCh['y'] = "\u0BB2";
avvCh['u'] = "\u0BB0";
avvCh['i'] = "\u0BC8";
avvCh['p'] = "\u0BBF";
avvCh['['] = "\u0BC1";
avvCh[']'] = "\u0BC2";

avvCh['A'] = "\u0BB9";
avvCh['H'] = "\u0BB4";
avvCh[':'] = "\u0BCD";
avvCh['"'] = "\u0B9E";

avvCh['a'] = "\u0BAF";
avvCh['s'] = "\u0BB3";
avvCh['d'] = "\u0BA9";
avvCh['f'] = "\u0B95";
avvCh['g'] = "\u0BAA";
avvCh['h'] = "\u0BBE";
avvCh['j'] = "\u0BA4";
avvCh['k'] = "\u0BAE";
avvCh['l'] = "\u0B9F";
avvCh['\''] = "\u0B99";

avvCh['Z'] = "\u0B90";
avvCh['X'] = "\u0B93";
avvCh['C'] = "\u0B8A";
avvCh['V'] = "\u0B8F";
avvCh['B'] = "\u0BB7";
avvCh['M'] = "\u0B86";
avvCh['<'] = "\u0B88";

avvCh['z'] = "\u0BA3";
avvCh['x'] = "\u0B92";
avvCh['c'] = "\u0B89";
avvCh['v'] = "\u0B8E";
avvCh['b'] = "\u0BC6";
avvCh['n'] = "\u0BC7";
avvCh['m'] = "\u0B85";
avvCh[','] = "\u0B87";
avvCh['.'] = ",";
avvCh['/'] = ".";

if(avvCh[letter])
{
	if(Tk_isAVKombuPulli(avvCh[letter]))
		avvCh[letter] = "\u200C"+avvCh[letter];
	if(Tk_prevChar == "\u0BC1" && (avvCh[letter] == "\u0BBE"  || avvCh[letter] == "\u200C\u0BC2") )
		return "\u200C\u0BC2";
	else if (Tk_prevChar == "\u0BC6" && avvCh[letter] == "\u0BBE")
		return "\u0BCA";
	else if (Tk_oldPrevChar != "\u200C" && Tk_prevChar == "\u0BC6" && avvCh[letter] == "\u0BB3")
		return "\u0BCC";
	else if(Tk_prevChar == "\u0BCC" && avvCh[letter] == "\u0BBE")
		return "\u0BC6\u0BB3"+avvCh[letter];
	else if(Tk_prevChar == "\u0B94" && avvCh[letter] == "\u0BBE" )
		return "\u0B92\u0BB3"+avvCh[letter];
	else if (Tk_prevChar == "\u0BC7" && avvCh[letter] == "\u0BBE")
		return "\u0BCB";
	else if(Tk_prevChar == "\u0B92" && avvCh[letter] == "\u0BB3")
		return "\u0B94";
	else
		return Tk_prevChar + avvCh[letter];
}
else
	return Tk_prevChar+letter;
}

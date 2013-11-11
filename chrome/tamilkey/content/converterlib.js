/*

This is the common library functions for all types of Tamilvisai converter keyboard.

*/

var Tk_ConverterLib =
{
	//initialize  variables here
	textNodeMap : new Array(),
	nodeId : 1,
	isNull : function(obj)
	{
		var r;
		try
		{
			r= obj==undefined || obj==null || obj.toString()=="";
		}
		catch (e)
		{
			r=true;
		}
		return r;
	},

	toggleEditor : function(func)
	{
		if (func==undefined || func==null) {
			throw "Translation function undefined.";
		}
		var CurrentNode = Tk_ConverterLib.getNode();
		if (CurrentNode==null || CurrentNode.node==null) {return null;}
		else
		{
			var attr = CurrentNode.node.getAttribute("TamilVisai.attribute.id");
			if (this.isNull(attr)) {	attr=0;		}
			var textNode = this.textNodeMap[attr];
			if (textNode==undefined || this.isNull(attr))
			{
				// define new text node
				attr = this.nodeId;
				CurrentNode.node.setAttribute("TamilVisai.attribute.id",attr);
				this.nodeId++;
				this.textNodeMap[attr] = CurrentNode;
			}
			else
				CurrentNode = this.textNodeMap[attr] ;
			CurrentNode.isConversion = (Tk_selKbrd != "english" && Tk_tamilMode == true);
			CurrentNode.keyBrdType = Tk_selKbrd;
			CurrentNode.setStyle();
			CurrentNode.setHandler(func);
		}
	},

	// try to initialize this text node with a focused node from the document.
	getNode : function()
	{
		retNode = new Tk_TextNode();
		var node = document.commandDispatcher.focusedElement;
		if (node==null)
		{
			if (document.commandDispatcher.focusedWindow)
			{
				if (document.commandDispatcher.focusedWindow.document)
				{
					// find ThunderBird compose window
					var editors = document.getElementsByTagName("editor");
					for (var i = 0; i < editors.length; i++)
					{
						if (editors[i].contentWindow == document.commandDispatcher.focusedWindow)
						{
							retNode.node = editors[i];
							return retNode;
						}
					}
				}
				node = document.commandDispatcher.focusedWindow.frameElement;
				if (node && node.contentDocument && node.contentDocument.designMode=="on")
				{
					retNode.node = node;
					return retNode;  // IFrame
				}
			}
		}
		else
		{
			var name = node.localName.toUpperCase();
			var type = node.type;
			if (name=="TEXTAREA" || name=="TEXTBOX" || (name=="INPUT" && (type=="text" || type=="file")))
			{
				if (!node.disabled && !node.readOnly)
				{
					retNode.node = node;
					return retNode;
				}
			}
		}
		return retNode;
	}
}

var Tk_TextNode = function()
{
	this.node = null;
	this.isConversion = false;
	this.borderStyle = null;
	this.backgroundColor = null;
	this.oldKeyHandler = null;
	this.keyBrdType = null;
}

Tk_TextNode.prototype.setStyle = function()
{
	if(this.isConversion)
	{
		var style = "dashed 1px blue";
		var bgcolor = "#f9f9ff";
		if(this.borderStyle != null)
		{
			this.borderStyle = this.node.style.border;
			this.backgroundColor = this.node.style.backgroundColor;
		}
		this.node.style.border = style;
		this.node.style.backgroundColor = bgcolor;
	}
	else
	{
		this.node.style.border = this.borderStyle;
		this.node.style.backgroundColor = this.backgroundColor;
	}
}

Tk_TextNode.prototype.setHandler = function(onKeyHandlerFunc)
{
	if(this.isConversion)
	{
		this.attachListener("keypress", onKeyHandlerFunc);
		this.attachListener("focus", Tk_resetMenus);
		this.attachListener("click", Tk_resetMenus);
	}
	else
		this.detachListener("keypress", onKeyHandlerFunc);

}

// attaches a listener to the txtnode, registers func to process, false - for bubbling
Tk_TextNode.prototype.attachListener  = function(eventToListen, onKeyHandlerFunc)
{
	if(eventToListen != "focus" && eventToListen != "click"
		&& this.oldKeyHandler != null )
		this.detachListener(eventToListen,this.oldKeyHandler);
	if (eventToListen == undefined || onKeyHandlerFunc == undefined)
		throw "Cannot attach listener.";
	if (this.node.contentDocument)
		this.node.contentDocument.documentElement.addEventListener(eventToListen, onKeyHandlerFunc, false);
	else
		this.node.addEventListener(eventToListen, onKeyHandlerFunc, false);
	if(eventToListen != "focus" && eventToListen != "click" )
		this.oldKeyHandler = onKeyHandlerFunc;
}


// detaches previously attached listener from the txtnode
Tk_TextNode.prototype.detachListener = function(eventToListen, onKeyHandlerFunc)
{
	if (eventToListen == undefined || onKeyHandlerFunc == undefined)
		throw "Cannot detach listener.";
	if (this.node.contentDocument)
		this.node.contentDocument.documentElement.removeEventListener(eventToListen, onKeyHandlerFunc, false);
	else
		this.node.removeEventListener(eventToListen, onKeyHandlerFunc, false);
}

function Tk_resetMenus(evt)
{
	CurrentNode = Tk_ConverterLib.getNode();
	if(CurrentNode.node == null) return;
	var attr = CurrentNode.node.getAttribute("TamilVisai.attribute.id");
	if (Tk_ConverterLib.isNull(attr)) {	return;		}
	textNode = Tk_ConverterLib.textNodeMap[attr];
	kbrd = textNode.keyBrdType;
	if(!Tk_tamilMode)
		kbrd = "english";
	Tk_setMenus(kbrd);
}

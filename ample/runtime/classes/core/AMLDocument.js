/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLDocument	= function(){};

cAMLDocument.prototype  = new cAMLNode;
cAMLDocument.prototype.nodeType	= cAMLNode.DOCUMENT_NODE;
cAMLDocument.prototype.nodeName	= "#document";

// Public Properties and Collections
cAMLDocument.prototype.activeElement	= null;

// nsIDOMDocument interface
cAMLDocument.prototype.documentElement	= null;
cAMLDocument.prototype.doctype			= null;
cAMLDocument.prototype.implementation	= null;

// nsIDOM3Document interface
cAMLDocument.prototype.documentURI		= null;
cAMLDocument.prototype.domConfig 		= null;
cAMLDocument.prototype.inputEncoding 	= null;
cAMLDocument.prototype.strictErrorChecking 	= null;
cAMLDocument.prototype.xmlEncoding 		= null;
cAMLDocument.prototype.xmlStandalone 	= null;
cAMLDocument.prototype.xmlVersion 		= null;

// Private Variables
var nAMLDocument_index	= 0;

// Public Methods
cAMLDocument.prototype.createAttribute	= function(sName)
{
	return this.createAttributeNS(null, sName);
};

cAMLDocument.prototype.createAttributeNS	= function(sNameSpaceURI, sQName)
{
//->Source
/*
	var oNode		= new cAMLAttr,
		aQName		= sQName.split(':'),
		sLocalName	= aQName.length > 1 ? aQName[1] : aQName[0],
		sPrefix		= aQName.length > 1 ? aQName[0] : null;

	oNode.ownerDocument	= this;
    oNode.localName		= sLocalName;
    oNode.prefix		= sPrefix;
    oNode.namespaceURI	= sNameSpaceURI;
    oNode.nodeName		= sQName;
	oNode.nodeValue		= '';
    oNode.name			= oNode.nodeName;
    oNode.value			= oNode.nodeValue;

	return oNode;
*/
//<-Source

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLDocument.prototype.createTextNode	= function(sData)
{
	// Validate arguments
	fAML_validate(arguments, [
		["data",	cString, true]
	], "createTextNode");

	// if no argument was provided, use empty string
	if (!arguments.length)
		sData	= '';

	var oNode	= new cAMLText;
	oNode.ownerDocument	= this;
	oNode.nodeValue	= sData;
	oNode.data		= sData;
	oNode.length	= sData.length;

	return oNode;
};

cAMLDocument.prototype.createCDATASection	= function(sData)
{
	// Validate arguments
	fAML_validate(arguments, [
		["data",	cString, true]
	], "createCDATASection");

	// if no argument was provided, use empty string
	if (!arguments.length)
		sData	= '';

	var oNode	= new cAMLCDATASection;
	oNode.ownerDocument	= this;
	oNode.nodeValue	= sData;
	oNode.data		= sData;
	oNode.length	= sData.length;

	return oNode;
};

cAMLDocument.prototype.createComment	= function(sData)
{
	// Validate arguments
	fAML_validate(arguments, [
		["data",	cString, true]
	], "createComment");

	// if no argument was provided, use empty string
	if (!arguments.length)
		sData	= '';

	var oNode	= new cAMLComment;
	oNode.ownerDocument	= this;
	oNode.nodeValue	= sData;
	oNode.data		= sData;
	oNode.length	= sData.length;

	return oNode;
};

cAMLDocument.prototype.createElement	= function(sName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["name",	cString]
	], "createElement");

	return this.createElementNS(this.namespaceURI, sName);
};

cAMLDocument.prototype.createElementNS	= function(sNameSpaceURI, sQName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString, false, true],
		["localName",		cString]
	], "createElementNS");

	var aQName		= sQName.split(':'),
		sLocalName	= aQName.length > 1 ? aQName[1] : aQName[0],
		sPrefix		= aQName.length > 1 ? aQName[0] : null,
		oNamespace	= oAML_namespaces[sNameSpaceURI],
		cElement	= oNamespace ? oNamespace.elements[sLocalName] : null,
		oElement	= new (cElement || cAMLElement),
		sName;

	// DOM Properties
	oElement.attributes		= {};
    oElement.ownerDocument	= this;
    oElement.prefix			= sPrefix;
    oElement.nodeName		= sQName;
    oElement.tagName		= sQName;
    oElement.childNodes		= new cAMLNodeList;

	// System properties
    oElement.uniqueID	= "ele_" + nAMLDocument_index++;

    //
	if (cElement) {
	    // Set default attributes, if defined
		for (sName in cElement.attributes)
			oElement.attributes[sName]	= cElement.attributes[sName];
	}
	else {
		// Set namespaceURI for unknown elements manually
		oElement.namespaceURI	= sNameSpaceURI;
    	oElement.localName		= sLocalName;
	}

    return oElement;
};

cAMLDocument.prototype.createEntityReference	= function(sName)
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLDocument.prototype.createEvent     = function(sName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["eventType",	cString]
	], "createEvent");

	var cEvent	= window["AML" + sName.replace(/s$/, '')];
	if (cEvent && (cEvent == cAMLEvent || cEvent.prototype instanceof cAMLEvent))
		return new cEvent;
	else
        throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLDocument.prototype.canDispatch	= function(sNameSpaceURI, sType)
{
	return true;
};

cAMLDocument.prototype.createDocumentFragment	= function()
{
	var oNode	= new cAMLDocumentFragment;
	oNode.ownerDocument	= this;
    oNode.childNodes	= new cAMLNodeList;

	return oNode;
};

cAMLDocument.prototype.createProcessingInstruction	= function(sTarget, sData)
{
	// Validate arguments
	fAML_validate(arguments, [
		["target",	cString],
		["data",	cString]
	], "createProcessingInstruction");

	var oNode	= new cAMLProcessingInstruction;
	oNode.ownerDocument	= this;
	oNode.nodeName	= oNode.target	= sTarget;
	oNode.nodeValue	= oNode.data	= sData;

	return oNode;
};

cAMLDocument.prototype.getElementById	= function(sId)
{
	// Validate arguments
	fAML_validate(arguments, [
		["id",	cString]
	], "getElementById");

    return oAML_ids[sId] || null;
};

cAMLDocument.prototype.getElementsByTagName	= function(sTagName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["name",	cString]
	], "getElementsByTagName");

    var aElements   = new cAMLNodeList,
    	bTagName	= '*' == sTagName;
	for (var sKey in oAML_all)
        if (bTagName || sTagName == oAML_all[sKey].tagName)
            aElements.$add(oAML_all[sKey]);
    return aElements;
};

cAMLDocument.prototype.getElementsByTagNameNS	= function(sNameSpaceURI, sLocalName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString, false, true],
		["localName",		cString]
	], "getElementsByTagNameNS");

    var aElements   = new cAMLNodeList,
    	bLocalName		= '*' == sLocalName,
    	bNameSpaceURI	= '*' == sNameSpaceURI;
    for (var sKey in oAML_all)
        if (bNameSpaceURI || sNameSpaceURI == oAML_all[sKey].namespaceURI)
        	if (bLocalName || sLocalName == oAML_all[sKey].localName)
            	aElements.$add(oAML_all[sKey]);
    return aElements;
};

cAMLDocument.prototype.importNode	= function(oNode, bDeep)
{
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cXMLElement],
		["deep",	cBoolean]
	], "importNode");

	if (oNode && oNode.nodeType == cAMLNode.ELEMENT_NODE)
		return fAML_import(oNode);
	else
		throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

// nsIDOM3Document
cAMLDocument.prototype.adoptNode		= function(oNode)
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLDocument.prototype.normalizeDocument	= function()
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLDocument.prototype.renameNode	= function(oNode, sNameSpaceURI, sQName)
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLDocument.prototype.getElementsByAttribute	= function(sName, sValue)
{
	// Validate arguments
	fAML_validate(arguments, [
		["name",	cString],
		["value",	cString, true]
	], "getElementsByAttribute");

    var aElements   = new cAMLNodeList,
    	bValue		= '*' == sValue;
    for (var sKey in oAML_all)
        if (oAML_all[sKey].hasAttribute(sName))
        	if (bValue || sValue == oAML_all[sKey].getAttribute(sName))
            	aElements.$add(oAML_all[sKey]);
    return aElements;
};

cAMLDocument.prototype.getElementsByAttributeNS	= function(sNameSpaceURI, sLocalName, sValue)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString, false, true],
		["localName",		cString],
		["value",			cString, true]
	], "getElementsByAttributeNS");

    var aElements   = new cAMLNodeList,
    	bValue		= '*' == sValue;
    for (var sKey in oAML_all)
        if (oAML_all[sKey].hasAttributeNS(sNameSpaceURI, sLocalName))
        	if (bValue || sValue == oAML_all[sKey].getAttributeNS(sNameSpaceURI, sLocalName))
            	aElements.$add(oAML_all[sKey]);
    return aElements;
};

// Private methods
/**
 * @return Object containing positioning properties in px
 */
cAMLDocument.prototype.getElementPosition	= function(oElement)
{
    return this.$getContainerPosition(oElement.$getContainer());
};

cAMLDocument.prototype.$getContainerPosition	= function(oElementDOM)
{
    var oPosition	= {},
    	oClientRect	= oElementDOM.getBoundingClientRect ? oElementDOM.getBoundingClientRect() : null,
    	oElement;

    // TODO: Get rid of scrollLeft/scrollTop here, remove the method completely and use from Element.getBoundingClientRect

	// Calculate scrolls
    oPosition.scrollLeft= 0;
    oPosition.scrollTop	= 0;

    // if 'getBoundingClientRect' is supported in the given browser
    if (oClientRect) {
	    oPosition.width	= oClientRect.right - oClientRect.left;
	    oPosition.height= oClientRect.bottom - oClientRect.top;
	    oPosition.left	= oClientRect.left;
	    oPosition.top	= oClientRect.top;
    }
    else {
	    oPosition.width		= oElementDOM.offsetWidth;
	    oPosition.height	= oElementDOM.offsetHeight;

		// Calculate offsets
	    oPosition.left		= 0;
	    oPosition.top		= 0;
		for (oElement = oElementDOM; oElement; oElement = oElement.offsetParent) {
	        oPosition.left	+= oElement.offsetLeft;
	        oPosition.top 	+= oElement.offsetTop;
		}

	    for (oElement = oElementDOM; oElement.nodeType == 1; oElement = oElement.parentNode) {
			oPosition.scrollLeft	+= oElement.scrollLeft;
			oPosition.scrollTop 	+= oElement.scrollTop;
		}
    }

    return oPosition;
};

function fAMLDocument_routeEvent(oEvent)
{
	var aTargets	= [],
		nLength		= 0,
		nCurrent	= 0;
	// Populate stack targets (...document-fragment, document, #document)
	for (var oNode = oEvent.target; oNode; oNode = oNode.parentNode)
		aTargets[nLength++]	= oNode;

//->Source
//console.info(oEvent.type, oEvent.target);
//<-Source

	// Propagate event
	while (true) {
		switch (oEvent.eventPhase) {
			case cAMLEvent.CAPTURING_PHASE:
				if (--nCurrent > 0)
					oEvent.currentTarget	= aTargets[nCurrent];
				else {
					// Do not propagate either target or bubbling for disabled elements
					if (oEvent instanceof cAMLUIEvent && oEvent.target instanceof cAMLElement && !oEvent.target.$isAccessible())
						return;

					oEvent.eventPhase		= cAMLEvent.AT_TARGET;
					oEvent.currentTarget	= oEvent.target;
				}
				break;

			case cAMLEvent.AT_TARGET:
				// if event does not bubble, return
				if (!oEvent.bubbles)
					return;
				// if event current target doesn't have a parent
				if (nCurrent < 0)
					return;
				oEvent.eventPhase	= cAMLEvent.BUBBLING_PHASE;
				// No break left intentionally
			case cAMLEvent.BUBBLING_PHASE:
				if (++nCurrent < nLength)
					oEvent.currentTarget	= aTargets[nCurrent];
				else
					return;
				break;

			default:
				// Set current target
				if (nLength > 1 && oAML_configuration.getParameter("ample-use-dom-capture")) {
					nCurrent	= nLength - 1;
					oEvent.eventPhase	= cAMLEvent.CAPTURING_PHASE;
					oEvent.currentTarget= aTargets[nCurrent];
				}
				else {
					// Do not propagate either target or bubbling for disabled elements
					if (oEvent instanceof cAMLUIEvent && oEvent.target instanceof cAMLElement && !oEvent.target.$isAccessible())
						return;

					nCurrent	= 0;
					oEvent.eventPhase	= cAMLEvent.AT_TARGET;
					oEvent.currentTarget= oEvent.target;
				}
		}

//->Source
//console.log(oEvent.currentTarget);
//<-Source

		// Handle event
		oEvent.currentTarget.$handleEvent(oEvent);

		// Break loop if propagation stopped
		if (oEvent._stopped)
			return;
	}
};

cAMLDocument.prototype.open	= function() {
	var aElements	= document.getElementsByTagName("script"),
		oElement	= aElements[aElements.length - 1];
	oElement.parentNode.removeChild(oElement);
	document.write('<' + "script" + ' ' + 'type' + '="' + "application/ample+xml" + '"' + '>');
};

cAMLDocument.prototype.close	= function() {
	document.write('</' + "script" + '>');
};

/*
cAMLDocument.prototype.$getAnonymousElement	= function(oElement, sPseudoName) {

};

cAMLDocument.prototype.$getElementByAnonymousElement	= function(oElementDOM) {

};
*/
//->Source
/*
// nsIDOMDocumentTraversal
cAMLDocument.prototype.createTreeWalker	= function(oNode, nWhatToShow, oFilter, bEntityReferenceExpansion)
{
	return new cAMLTreeWalker(oNode, nWhatToShow, oFilter, bEntityReferenceExpansion);
};
*/
//<-Source

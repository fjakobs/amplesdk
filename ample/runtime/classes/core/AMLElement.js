/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLElement	= function(){};

cAMLElement.prototype	= new cAMLNode;
cAMLElement.prototype.nodeType	= cAMLNode.ELEMENT_NODE;

// nsIDOMElement
cAMLElement.prototype.tagName	= null;
cAMLElement.prototype.uniqueID	= null;

// Private Variables
var nAMLElement_prefix	= 0;

// Public Methods
cAMLElement.prototype.appendChild	= function(oNode)
{
	if (oNode instanceof cAMLDocumentFragment) {
		while (oNode.firstChild)
			this.appendChild(oNode.firstChild);
	}
	else {
		// Call parent class method
		cAMLNode.prototype.appendChild.call(this, oNode);

		// Append DOM
		var oGateway, oElement;
		if (this.nodeType == cAMLNode.ELEMENT_NODE)
			if (oGateway =(this.$getContainer("gateway") || this.$getContainer()))
				if (oElement = (oNode.$getContainer() || fAML_render(oNode)))
			   		oGateway.appendChild(oElement);

		// Register Instance
		if (oAML_all[this.uniqueID] && !oAML_all[oNode.uniqueID])
			fAML_register(oNode);
	}

	//
    return oNode;
};

cAMLElement.prototype.insertBefore	= function(oNode, oBefore)
{
	if (oNode instanceof cAMLDocumentFragment) {
		while (oNode.firstChild)
			this.insertBefore(oNode.firstChild, oBefore);
	}
	else {
		// Call parent class method
		cAMLNode.prototype.insertBefore.call(this, oNode, oBefore);

		// Insert DOM
		var oGateway, oChild;
		if (this.nodeType == cAMLNode.ELEMENT_NODE)
			if ((oGateway =(this.$getContainer("gateway") || this.$getContainer())))
				if (oChild = (oNode.$getContainer() || fAML_render(oNode)))
		    		oGateway.insertBefore(oChild, function() {
		    			for (var oElement; oBefore; oBefore = oBefore.nextSibling)
		    				if (oElement = oBefore.$getContainer())
		    					return oElement;
		    			return null;
		    		}());

		// Register Instance
		if (oAML_all[this.uniqueID] && !oAML_all[oNode.uniqueID])
			fAML_register(oNode);
	}

	//
    return oNode;
};

cAMLElement.prototype.removeChild	= function(oNode)
{
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode]
	], "removeChild");

	// Fire Mutation event
    if (oAML_configuration.getParameter("ample-use-dom-events")) {
	    var oEvent = new cAMLMutationEvent;
	    oEvent.initMutationEvent("DOMNodeRemoved", true, false, this, null, null, null, null);
	    oNode.dispatchEvent(oEvent);
    }

	// Unregister Instance
	if (oAML_all[this.uniqueID])
		fAML_unregister(oNode);

	// Call parent class method
	cAMLNode.prototype.removeChild.call(this, oNode);

	// Remove from DOM
	var oChild, oGateway;
	if (this.nodeType == cAMLNode.ELEMENT_NODE)
		if ((oChild = oNode.$getContainer()) && (oGateway =(this.$getContainer("gateway") || this.$getContainer())))
			oGateway.removeChild(oChild);

	return oNode;
};

cAMLElement.prototype.replaceChild	= function(oNode, oOld)
{
	if (oNode instanceof cAMLDocumentFragment) {
		while (oNode.firstChild)
			this.insertBefore(oNode.firstChild, oOld);
		// remove child if passed
		if (oOld)
			this.removeChild(oOld);
	}
	else {
		// Call parent class method
		cAMLNode.prototype.replaceChild.call(this, oNode, oOld);

		// Unregister Instance
		fAML_unregister(oOld);

		// Replace in from DOM
		var oElement, oGateway, oChild;
		if (this.nodeType == cAMLNode.ELEMENT_NODE)
			if ((oGateway =(this.$getContainer("gateway") || this.$getContainer())) && (oChild = oOld.$getContainer()))
				if (oElement = (oNode.$getContainer() || fAML_render(oNode)))
			    	oGateway.replaceChild(oElement, oChild);

		// Register Instance
		if (oAML_all[this.uniqueID] && !oAML_all[oNode.uniqueID])
			fAML_register(oNode);
	}

	return oOld;
};

cAMLElement.prototype.cloneNode	= function(bDeep)
{
	// Create Element
	var oElement	= this.ownerDocument.createElementNS(this.namespaceURI, this.nodeName);

	// Copy Attributes
	for (var sName in this.attributes)
		oElement.attributes[sName]	= this.attributes[sName];

	// Append Children
	if (bDeep)
		for (var nIndex = 0; nIndex < this.childNodes.length; nIndex++)
			cAMLNode.prototype.appendChild.call(oElement, this.childNodes[nIndex].cloneNode(bDeep));
	return oElement;
};

cAMLElement.prototype.hasAttribute	= function(sName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["name",		cString]
	], "hasAttribute");

	return sName in this.attributes;
};

cAMLElement.prototype.hasAttributeNS	= function(sNameSpaceURI, sLocalName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString, false, true]
		["localName",		cString]
	], "hasAttributeNS");

	if (sNameSpaceURI == null)
		return this.hasAttribute(sLocalName);

	var sPrefix	= this.lookupPrefix(sNameSpaceURI);
	return sPrefix ? this.hasAttribute(sPrefix + ':' + sLocalName) : false;
};

cAMLElement.prototype.setAttribute	= function(sName, sValue)
{
	// Validate arguments
	fAML_validate(arguments, [
		["name",		cString],
		["value",		cObject]
	], "setAttribute");

	// convert value to string
	sValue	= cString(sValue);
	var sValueOld	= this.attributes[sName],
		bValue		= sName in this.attributes;

    if (sValueOld != sValue) {
    	// Only operate on shadow if element is in the DOM
    	if (this.uniqueID in oAML_all && (sName == "id" || sName == "class" || sName == "style")) {
    		// Find shadow content first
    		var oElementDOM	= this.$getContainer();
    		if (sName == "id") {
	    		if (sValue)
	    			oAML_ids[sValue]	= this;
    			delete oAML_ids[sValueOld];
	    	}
    		// Update view
    		if (oElementDOM) {
		    	if (sName == "class") {
		    		var sValueClass	=(this.prefix ? this.prefix + '-' : '') + this.localName + (sValue ? ' ' + sValue : '');
		    		if (bTrident)
		    			oElementDOM.className	= sValueClass;
		    		else
		    			oElementDOM.setAttribute("class", sValueClass);
		    	}
		    	else
		    	if (sName == "style")
	    			oElementDOM.style.cssText	= sValue;
		    	else
	    			oElementDOM.id	= sValue ? sValue : this.uniqueID;
    		}
    	}

    	//
    	this.attributes[sName]	= sValue;

    	// Fire Mutation event
    	if (this.uniqueID in oAML_all && oAML_configuration.getParameter("ample-use-dom-events")) {
		    var oEvent = new cAMLMutationEvent;
		    oEvent.initMutationEvent("DOMAttrModified", true, false, null, bValue ? sValueOld : null, sValue, sName, bValue ? cAMLMutationEvent.MODIFICATION : cAMLMutationEvent.ADDITION);
		    this.dispatchEvent(oEvent);
    	}
    }
};

cAMLElement.prototype.setAttributeNS	= function(sNameSpaceURI, sQName, sValue)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString, false, true],
		["qualifiedName",	cString],
		["value",			cObject]
	], "setAttributeNS");

	if (sNameSpaceURI == null)
		return this.setAttribute(sQName, sValue);

	// convert value to string
	sValue	= cString(sValue);

	var sElementPrefix	= this.lookupPrefix(sNameSpaceURI),
		aQName		= sQName.split(':'),
		sLocalName	= aQName.length > 1 ? aQName[1] : aQName[0],
		sPrefix		= aQName.length > 1 ? aQName[0] : null;

	if (sPrefix)
	{
		if (!sElementPrefix || (sPrefix != sElementPrefix))
			// Put namespace declaration
			this.attributes["xmlns" + ':' + sPrefix]	= sNameSpaceURI;
	}
	else
	{
		if (sElementPrefix)
			sPrefix	= sElementPrefix;
		else
		{
			// Create fake prefix
			sPrefix	= '_' + 'p' + nAMLElement_prefix++;

			// Put namespace declaration
			this.attributes["xmlns" + ':' + sPrefix]	= sNameSpaceURI;
		}
		//
		sQName	= sPrefix + ':' + sLocalName;
	}

	// Global attributes module
	if (!(sQName in this.attributes) && !(sQName == "xmlns" || sNameSpaceURI == "http://www.w3.org/2000/xmlns/" || sNameSpaceURI == "http://www.w3.org/XML/1998/namespace"))
	{
		var oNamespace	= oAML_namespaces[sNameSpaceURI],
			cAttribute	= oNamespace ? oNamespace.attributes[sLocalName] : null,
			oAttribute,
			oEvent;

		if (cAttribute)
		{
			// oAttribute used to create fake object
			oAttribute	= new cAttribute;
			oAttribute.ownerElement	= this;
			oAttribute.nodeValue	= sValue;
			oAttribute.nodeName		= sQName;
			oAttribute.localName	= sLocalName;
			oAttribute.prefix		= sPrefix;
			oAttribute.namespaceURI	= sNameSpaceURI;
			oAttribute.name		= sQName;
			oAttribute.value	= sValue;

			// Fire Mutation event (pseudo)
			oEvent = new cAMLMutationEvent;
			oEvent.initMutationEvent("DOMNodeInsertedIntoDocument", false, false, null, null, null, null, null);
			oAttribute.$handleEvent(oEvent);
		}
	}

	// Set attribute
	this.setAttribute(sQName, sValue);
};

cAMLElement.prototype.setAttributeNode	= function(oAttribute)
{
	this.setAttributeNodeNS(oAttribute);
};

cAMLElement.prototype.setAttributeNodeNS	= function(oAttribute)
{
//->Source
/*
	// Validate arguments
	fAML_validate(arguments, [
		["node",		cAMLAttr]
	], "setAttributeNodeNS");

	//
	oAttribute.ownerElement	= this;
	this.setAttributeNS(oAttribute.namespaceURI, oAttribute.nodeName, oAttribute.nodeValue);
*/
//<-Source
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLElement.prototype.getAttribute	= function(sName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["name",			cString]
	], "getAttribute");

    return this.attributes[sName] || '';
};

cAMLElement.prototype.getAttributeNS	= function(sNameSpaceURI, sLocalName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString, false, true],
		["localName",		cString]
	], "getAttributeNS");

	if (sNameSpaceURI == null)
		return this.getAttribute(sLocalName);

	var sPrefix	= this.lookupPrefix(sNameSpaceURI);
    return sPrefix ? this.getAttribute(sPrefix + ':' + sLocalName) : '';
};

cAMLElement.prototype.getAttributeNode	= function(sName)
{
	return this.getAttributeNodeNS(null, sName);
};

cAMLElement.prototype.getAttributeNodeNS	= function(sNameSpaceURI, sLocalName)
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLElement.prototype.removeAttribute	= function(sName)
{
	fAML_validate(arguments, [
		["name",	cString]
	], "removeAttribute");

	if (sName in this.attributes) {
		var sValueOld	= this.attributes[sName];
		// Only operate on shadow if element is in the DOM
    	if (this.uniqueID in oAML_all && (sName == "id" || sName == "class" || sName == "style")) {
    		// Find shadow content
    		var oElementDOM	= this.$getContainer();
    		if (sName == "id") {
		    	delete oAML_ids[sValueOld];
		    }
		    // Update view
		    if (oElementDOM) {
			    if (sName == "class") {
			    	var sValueClass	=(this.prefix ? this.prefix + '-' : '') + this.localName;
			    	if (bTrident)
			    		oElementDOM.className	= sValueClass;
			    	else
			    		oElementDOM.setAttribute("class", sValueClass);
			    }
			    else
			    if (sName == "style")
			    	oElementDOM.style.cssText	= '';
			    else
			    	oElementDOM.id	= this.uniqueID;
		    }
    	}
	    //
	    delete this.attributes[sName];

		// Fire Mutation event
	    if (this.uniqueID in oAML_all && oAML_configuration.getParameter("ample-use-dom-events")) {
		    var oEvent = new cAMLMutationEvent;
		    oEvent.initMutationEvent("DOMAttrModified", true, false, null, sValueOld, null, sName, cAMLMutationEvent.REMOVAL);
		    this.dispatchEvent(oEvent);
	    }
	}
};

cAMLElement.prototype.removeAttributeNS	= function(sNameSpaceURI, sLocalName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString, false, true],
		["localName",		cString]
	], "removeAttributeNS");

	if (sNameSpaceURI == null)
		return this.removeAttribute(sLocalName);

	var sPrefix	= this.lookupPrefix(sNameSpaceURI),
		sQName	= sPrefix + ':' + sLocalName;

	if (!sPrefix)
		return;

	// Global attributes module
	if (sQName in this.attributes && !(sLocalName == "xmlns" || sNameSpaceURI == "http://www.w3.org/2000/xmlns/" || sNameSpaceURI == "http://www.w3.org/XML/1998/namespace"))
	{
		var oNamespace	= oAML_namespaces[sNameSpaceURI],
			cAttribute	= oNamespace ? oNamespace.attributes[sLocalName] : null,
			sValue		= this.attributes[sQName],
			oAttribute,
			oEvent;

		if (cAttribute)
		{
			// oAttribute used to create fake object
			oAttribute	= new cAttribute;
			oAttribute.ownerElement	= this;
			oAttribute.nodeValue	= sValue;
			oAttribute.nodeName		= sQName;
			oAttribute.localName	= sLocalName;
			oAttribute.prefix		= sPrefix;
			oAttribute.namespaceURI	= sNameSpaceURI;
			oAttribute.name		= sQName;
			oAttribute.value	= sValue;

			// Fire Mutation event (pseudo)
			oEvent = new cAMLMutationEvent;
			oEvent.initMutationEvent("DOMNodeRemovedFromDocument", false, false, null, null, null, null, null);
			oAttribute.$handleEvent(oEvent);
		}
	}

    this.removeAttribute(sQName);
};

cAMLElement.prototype.removeAttributeNode	= function(oAttribute)
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLElement.prototype.hasChildNodes	= function()
{
	return this.childNodes.length > 0;
};

cAMLElement.prototype.getElementsByTagName	= function(sTagName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["name",	cString]
	], "getElementsByTagName");

	var aElements	= new cAMLNodeList,
		bTagName	= '*' == sTagName;
	(function(oElement) {
		for (var nIndex = 0, oNode; oNode = oElement.childNodes[nIndex]; nIndex++) {
			if (oNode.nodeType == cAMLNode.ELEMENT_NODE) {
				if (bTagName || sTagName == oNode.tagName)
					aElements.$add(oNode);
				if (oNode.childNodes.length)
					arguments.callee(oNode);
			}
		}
	})(this);
	return aElements;
};

cAMLElement.prototype.getElementsByTagNameNS	= function(sNameSpaceURI, sLocalName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString],
		["localName",		cString]
	], "getElementsByTagNameNS");

	var aElements	= new cAMLNodeList,
		bNameSpaceURI	= '*' == sNameSpaceURI,
		bLocalName		= '*' == sLocalName;
	(function(oElement) {
		for (var nIndex = 0, oNode; oNode = oElement.childNodes[nIndex]; nIndex++) {
			if (oNode.nodeType == cAMLNode.ELEMENT_NODE) {
				if ((bLocalName || sLocalName == oNode.localName) && (bNameSpaceURI || sNameSpaceURI == oNode.namespaceURI))
					aElements.$add(oNode);
				if (oNode.childNodes.length)
					arguments.callee(oNode);
			}
		}
	})(this);
	return aElements;
};
/*
cAMLElement.prototype.focus	= function()
{

};

cAMLElement.prototype.blur	= function()
{

};
*/

cAMLElement.prototype.$handleEvent	= function(oEvent)
{
	cAMLNode.prototype.$handleEvent.call(this, oEvent);

	// Notify element event handlers
	var oNamespace,
		cElement;

	// Event default actions implementation
	if (oEvent.eventPhase != cAMLEvent.CAPTURING_PHASE && !oEvent.defaultPrevented)
		if ((oNamespace = oAML_namespaces[this.namespaceURI]) && (cElement = oNamespace.elements[this.localName]))
			if (cElement.handlers && cElement.handlers[oEvent.type])
				cElement.handlers[oEvent.type].call(this, oEvent);
};

cAMLElement.prototype.$activate	= function()
{
	var oEvent	= new cAMLUIEvent;
	oEvent.initUIEvent("DOMActivate", true, true, window, null);
	this.dispatchEvent(oEvent);
};

cAMLElement.prototype.$getTag		= function()
{
	var aHtml	= [this.$getTagOpen().replace(/^(\s*<[\w:]+)/, '$1 id="' +(this.attributes.id || this.uniqueID)+ '"')];
	for (var nIndex = 0; nIndex < this.childNodes.length; nIndex++)
		aHtml[aHtml.length]	= this.childNodes[nIndex].$getTag();
	return aHtml.join('') + this.$getTagClose();
};

cAMLElement.prototype.$getTagOpen	= function()
{
	return '';
};

cAMLElement.prototype.$getTagClose	= function()
{
	return '';
};

/*
cAMLElement.prototype.$getContainer	= function(sName) {
	var sId	= this.uniqueID + (sName ? '_' + sName : '');
    if (!this.$cache)
    	this.$cache	= {};
    return this.$cache[sId] ||(this.$cache[sId] = document.getElementById(sId));
};
*/
/*
cAMLElement.prototype.$getContainer	= function(sName)
{
   	return document.getElementById(this.uniqueID + (sName ? '_' + sName : ''));
};
*/

cAMLElement.prototype.getBoundingClientRect	= function(sPseudo)
{
	var oPosition	= this.ownerDocument.$getContainerPosition(this.$getContainer(sPseudo)),
		oRectangle	= {};
	oRectangle.top		= oPosition.top;
	oRectangle.right	= oPosition.left + oPosition.width;
	oRectangle.bottom	= oPosition.top + oPosition.height;
	oRectangle.left		= oPosition.left;

	return oRectangle;
};
/*
cAMLElement.prototype.$getContainer	= function(sName)
{
	var sShadow	= '#' +(sName || ''),
		oCache	= oAML_shadow[this.uniqueID] ||(oAML_shadow[this.uniqueID] = {});

	if (sShadow in oCache)
		return oCache[sShadow];
	else {
		var oNode	= document.getElementById(this.attributes.id || this.uniqueID);
		if (sName && oNode) {
			var rClass	= new cRegExp('--' + sName + '(\\s|$)');
			oNode	= (function (oContext, oNode) {
				for (var nIndex = 0, aNodes = oNode.childNodes, oElement, sClass; oNode = aNodes[nIndex]; nIndex++)
					if (oNode.nodeType == 1 && !oNode.id) {
						// If pseudo-element
						if ((sClass = oNode.className) && sClass.match(rClass))
							return oNode;
						// Check children
						if (oElement = arguments.callee(oContext, oNode))
							return oElement;
					}
				return null;
			})(this, oNode);
		}
		return oCache[sShadow]	= oNode;
	}
};
*/
cAMLElement.prototype.$getContainer	= function(sName)
{
	var oNode	= document.getElementById(this.attributes.id || this.uniqueID);
	if (sName && oNode) {
		var rClass	= new cRegExp('--' + sName + '(\\s|$)');
		return (function (oContext, oNode) {
			for (var nIndex = 0, aNodes = oNode.childNodes, oElement, sClass; oNode = aNodes[nIndex]; nIndex++)
				if (oNode.nodeType == 1 && !oNode.id) {
					// If pseudo-element
					if ((sClass = oNode.className) && sClass.match(rClass))
						return oNode;
					// Check children
					if (oElement = arguments.callee(oContext, oNode))
						return oElement;
				}
			return null;
		})(this, oNode);
	}
	return oNode;
};

/*
function fAMLElement_setPseudoClass(oElement, sName, bValue, sContainer)
{
	var oElementDOM	= oElement.$getContainer(sContainer);
    oElementDOM.className	= oElementDOM.className.replace(/(\w+-[a-z\-]+)?_(\w+)?/ig, '$1_' + (bValue ? sName : ''));
};
*/
/*
function fAMLElement_addClass(oElement, sClass) {
	if (!fAMLElement_hasClass(oElement, sClass))
		oElement.className += ' ' + sClass;
};

function fAMLElement_hasClass(oElement, sClass) {
	return oElement.className.match(fAMLElement_getRegExp(sClass));
};

function fAMLElement_removeClass(oElement, sClass) {
	if (fAMLElement_hasClass(oElement, sClass))
		oElement.className	= oElement.className.replace(fAMLElement_getRegExp(sClass), ' ');
};
*/

var oAMLElement_cache	= {};
function fAMLElement_getRegExp(sName) {
	return	oAMLElement_cache[sName]
		?	oAMLElement_cache[sName]
		:	oAMLElement_cache[sName] = new cRegExp('(|^)[-\\w]*' + sName + '(\\s|$)', 'g');
};

function fAMLElement_setPseudoClass(oElement, sName, bValue, sContainer)
{
	var oElementDOM	= oElement.$getContainer(sContainer),
		sClass		= oElement.getAttribute("class"),
		sPseudoName	=(sContainer ? '--' + sContainer : '') + '_' + sName,
		sTagName	=(oElement.prefix ? oElement.prefix + '-' : '') + oElement.localName;

//->Source
//console.warn("processing: " + oElement.tagName + ' ' + sName + '(' + (bValue ? 'true' : 'false') + ')');
//console.log("before: ", oElementDOM.className);
//<-Source

	if (oElementDOM) {
		var bMatch	= oElementDOM.className.match(fAMLElement_getRegExp(sPseudoName));
		if (bValue) {
			// Add class
			if (!bMatch) {
				oElementDOM.className += (sClass
											? ' ' + sTagName + '-' + sClass + sPseudoName + ' ' + sClass + sPseudoName
											: '') +
											' ' + sTagName + sPseudoName;
			}
		}
		else {
			// Remove class
			if (bMatch)
				oElementDOM.className	= oElementDOM.className.replace(fAMLElement_getRegExp(sPseudoName), ' ');	// TODO: Remove space?
		}
	}
//->Debug
	else
		fAML_warn(nAML_NOT_FOUND_SHADOW_WRN, [oElement.tagName, sContainer || '']);
//<-Debug

//->Source
//console.log("after: ", oElementDOM.className);
//<-Source
};

// Attaching to impementation
cAMLElement.prototype.$setPseudoClass	= function(sName, bState, sContainer)
{
	// Validate arguments
	fAML_validate(arguments, [
		["name",	cString],
		["state",	cBoolean],
		["pseudoElement",	cString, true]
	], "$setPseudoClass");

	fAMLElement_setPseudoClass(this, sName, bState, sContainer);
};

// Content Loader
function fAMLElement_load(oElement, sUrl, sMethod, oHeaders, sData)
{
	if (oElement._timeout)
		fClearTimeout(oElement._timeout);
	if (oElement._request)
		oElement._request["on" + "readystatechange"]	= new cFunction;

	// Dispatch unload event
	var oEvent	= new cAMLEvent;
	oEvent.initEvent("unload", false, false);
	oElement.dispatchEvent(oEvent);

	// Remove nodes
	while (oElement.firstChild)
		oElement.removeChild(oElement.firstChild);

	// Do timeout before loading
	oElement._timeout	= fSetTimeout(function(){fAMLElement_onTimeOut(oElement, sUrl, oHeaders, sMethod, sData)}, 1);
	oElement._request	= null;
};

function fAMLElement_onTimeOut(oElement, sUrl, oHeaders, sMethod, sData)
{
	// Create request
	var oRequest	= new cXMLHttpRequest;
	oRequest["on" + "readystatechange"]	= function(){fAMLElement_onReadyStateChange(oRequest, oElement)};
	oRequest.open(sMethod, sUrl, true);
	oHeaders["User-Agent"]	=(oHeaders["User-Agent"] || oNavigator.userAgent) + ' ' + '@project.userAgent@';
	for (var sHeader in oHeaders)
		oRequest.setRequestHeader(sHeader, oHeaders[sHeader]);
	oRequest.send(sData);

	// Save in order to be able to cancel
	oElement._timeout	= null;
	oElement._request	= oRequest;
};

function fAMLElement_onReadyStateChange(oRequest, oElement)
{
	if (oRequest.readyState == 4)
	{
		// Remove memory leak in IE
		oRequest["on" + "readystatechange"]	= new cFunction;
	    delete oElement._timeout;
	    delete oElement._request;

	    if (oRequest.responseXML && oRequest.responseXML.documentElement && !oRequest.responseXML.getElementsByTagName("parsererror")[0])
	    {
			// Render Content
			oElement.appendChild(fAML_import(oRequest.responseXML.documentElement, null));

			// Dispatch load event
			var oEvent	= new cAMLEvent;
			oEvent.initEvent("load", false, false);
			oElement.dispatchEvent(oEvent);
	    }
	    else
	    {
//->Debug
			fAML_warn(nAML_NOT_WELLFORMED_WRN);
//<-Debug

			// Dispatch load event
			var oEvent	= new cAMLEvent;
			oEvent.initEvent("error", true, false);
			oElement.dispatchEvent(oEvent);
	    }
	}
};

cAMLElement.prototype.$load	= function(sUrl, sMethod, oHeaders, sData)
{
	// Validate arguments
	fAML_validate(arguments, [
		["url",		cString],
		["method",	cString, true, true],
		["headers",	cObject, true, true],
		["data",	cString, true, true]
	], "$load");

	fAMLElement_load(this, sUrl, sMethod || "GET", oHeaders || {}, sData || null);
};


cAMLElement.prototype.scrollIntoView	= function(bTop) {
	// Validate arguments
	fAML_validate(arguments, [
		["top",	cBoolean, true, false]	// Optional, null is not allowed
	], "scrollIntoView");

	var oElementDOM	= this.$getContainer();
	if (oElementDOM) {
		if (oElementDOM.scrollIntoView)
			oElementDOM.scrollIntoView(bTop || false);
		else {
			// TODO: Implement. FF for example doesn't support it on SVG elements
		}
	}
};

/*
cAMLElement.prototype.$getPseudoElement	= function(sName)
{
   	return this.$getContainer(sName);
};
*/

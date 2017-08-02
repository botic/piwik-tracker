/**
 * A simple wrapper around the Piwik tracking HTTP API.
 *
 * The RingoJS implementation is based on / inspired by the Node.js wrapper
 * for Piwik by <a href="https://github.com/fhemberger/piwik-tracker">Frederic Hemberger</a>.
 *
 * @license MIT
 */

"use strict";

const assert = require("assert");
const strings = require("ringo/utils/strings");
const {request} = require("ringo/httpclient");
const {urlEncode} = require("ringo/utils/http");
const {merge} = require("ringo/utils/objects");

/**
 * @constructor
 * @param {number|string} siteId identifier of the site this client tracks
 * @param {string} trackerUrl URL of the Piwik instance
 * @param {object} defaultOptions default options to set for each tracking request
 */
const PiwikTracker = module.exports = function PiwikTracker (siteId, trackerUrl, defaultOptions) {
    if (!(this instanceof PiwikTracker)) { return new PiwikTracker(siteId, trackerUrl); }

    assert.ok(siteId && (typeof siteId === "number" || typeof siteId == "string"), "Piwik siteId required.");
    assert.ok(trackerUrl && typeof trackerUrl == "string", "Piwik tracker URL required, e.g. http://example.org/piwik.php");
    assert.ok(strings.endsWith(trackerUrl, "piwik.php"), "A tracker URL must end with \"piwik.php\"");
    assert.ok(defaultOptions == null || typeof defaultOptions === "object", "defaultOptions must be of type object or not defined.");

    this.siteId = String(siteId);
    this.trackerUrl = trackerUrl;
    this.defaultOptions = defaultOptions || {};
};

/**
 * Sends a tracking request to the Piwik API.
 * @param {string} url the URL to track
 * @param {object} options optional parameters for the Tracking API
 * @returns {boolean} true if the request was successful, false otherwise
 * @see <a href="https://developer.piwik.org/api-reference/tracking-api">Piwik Tracking API</a>
 */
PiwikTracker.prototype.track = function(url, options) {
    const queryParams = merge(options, this.defaultOptions, {
        rec: 1,
        url: url,
        idsite: this.siteId
    });

    const exchange = request({
        method: "GET",
        url: this.trackerUrl + "?" + urlEncode(queryParams)
    });

    return exchange.status === 200;
};

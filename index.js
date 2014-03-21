
/**
 * Module dependencies.
 */

var spawn = require('child_process').spawn
  , debug = require('debug')('pygments');

/**
 * Highlight the given code `str` as `lang`
 * and invoke `fn(err, html)`.
 *
 * @param {String} str
 * @param {String} lang
 * @param {Function} fn
 * @api public
 */

module.exports = function(str, lang, fn){
  var args = ['-l', lang, '-f', 'html', '-O', 'encoding=utf8,linespans=line,lineanchors=line'];
  var buf = '';

  if ('function' == typeof lang) {
    fn = lang;
    args = ['-g', '-f', 'html', '-O', 'encoding=utf8,linespans=line,lineanchors=line'];
  }

  debug('highlight %s', lang);
  var proc = spawn('pygmentize', args);
  proc.stdout.setEncoding('utf8');
  proc.stdout.on('data', function(s){ buf += s });
  proc.on('close', function(){ fn(null, buf) });
  proc.stdin.write(str);
  proc.stdin.end();
};

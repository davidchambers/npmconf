var test = require('tap').test
var npmconf = require('../npmconf.js')
var common = require('./00-setup.js')
var path = require('path')

var ucData =
  { globalconfig: common.globalconfig,
    email: 'i@izs.me',
    'env-thing': 'asdf',
    'init.author.name': 'Isaac Z. Schlueter',
    'init.author.email': 'i@izs.me',
    'init.author.url': 'http://blog.izs.me/',
    'init.version': '1.2.3',
    'proprietary-attribs': false,
    'npm:publishtest': true,
    '_npmjs.org:couch': 'https://admin:password@localhost:5984/registry',
    'npm-www:nocache': '1',
    nodedir: '/Users/isaacs/dev/js/node-v0.8',
    'sign-git-tag': true,
    message: 'v%s',
    'strict-ssl': false,
    'tmp': process.env.HOME + '/.tmp',
    _token:
     { AuthSession: 'yabba-dabba-doodle',
       version: '1',
       expires: '1345001053415',
       path: '/',
       httponly: true } }

var envData = common.envData
var envDataFix = common.envDataFix

var gcData = { 'package-config:foo': 'boo' }

var biData = { 'builtin-config': true }

var cli = { foo: 'bar', heading: 'foo', 'git-tag-version': false }

var projectData = {}

var expectList =
[ cli,
  envDataFix,
  projectData,
  ucData,
  gcData,
  biData ]

var expectSources =
{ cli: { data: cli },
  env:
   { data: envDataFix,
     source: envData,
     prefix: '' },
  project:
    { path: path.resolve(__dirname, '..', '.npmrc'),
      type: 'ini',
      data: projectData },
  user:
   { path: common.userconfig,
     type: 'ini',
     data: ucData },
  global:
   { path: common.globalconfig,
     type: 'ini',
     data: gcData },
  builtin: { data: biData } }

test('with builtin', function (t) {
  npmconf.load(cli, common.builtin, function (er, conf) {
    if (er) throw er
    t.same(conf.list, expectList)
    t.same(conf.sources, expectSources)
    t.same(npmconf.rootConf.list, [])
    t.equal(npmconf.rootConf.root, npmconf.defs.defaults)
    t.equal(conf.root, npmconf.defs.defaults)
    t.equal(conf.get('heading'), 'foo')
    t.equal(conf.get('git-tag-version'), false)
    t.end()
  })
})

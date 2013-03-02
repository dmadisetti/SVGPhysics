require 'openssl'
require 'sinatra'
require 'rack/ssl'

use Rack::SSL

use Rack::Static, :urls => ["/static"]
get '/' do
  erb:index
end
require 'sinatra'

use Rack::SSL

use Rack::Static, :urls => ["/static"]

get '/' do
  erb:index
end
require 'sinatra'

use Rack::Static, :urls => ["/static"]

get '/' do
  erb:index
end
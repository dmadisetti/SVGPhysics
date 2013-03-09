require 'openssl'
require 'sinatra'
require 'rack/ssl'
require 'pg'
conn = PGconn.connect('ec2-23-21-89-65.compute-1.amazonaws.com', 5432, '', '', 'd66aimi70ef5kg', 'dtrodkftrfqyyg', 'Ye8IKyxUWHah2s6Ca_QZ0lbzkO')
res  = conn.exec('select * from main')
print res

#require 'data_mapper'

#DataMapper.setup(:default, ENV['DATABASE_URL'] || 'postgres://localhost/mydb')

use Rack::SSL

use Rack::Static, :urls => ['/static']
get '/' do
  erb:index
end
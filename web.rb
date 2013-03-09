require 'openssl'
require 'sinatra'
require 'rack/ssl'
require 'pg'
conn = PGconn.connect('ec2-23-21-89-65.compute-1.amazonaws.com', 5432, nil, nil, 'd66aimi70ef5kg', 'dtrodkftrfqyyg', 'Ye8IKyxUWHah2s6Ca_QZ0lbzkO')


#require 'data_mapper'

#DataMapper.setup(:default, ENV['DATABASE_URL'] || 'postgres://localhost/mydb')

use Rack::SSL

use Rack::Static, :urls => ['/static']
get '/' do
  res=conn.exec('select * from main')
  num = res.cmd_tuples()
  return num.to_s()
  #erb:index, locals: {level: res}
end
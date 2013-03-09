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
  test = ''
  res=conn.exec('select * from main') do |result|
    result.each do |row|
      test += row
    end
  end
  return test.to_s()

def construct(object,level)
	res=conn.exec('select * from'+object)
end
  #erb:index, locals: {level: res}
end
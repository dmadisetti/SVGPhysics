require 'openssl'
require 'sinatra'
require 'rack/ssl'
require 'pg'
$conn = PGconn.connect('ec2-23-21-89-65.compute-1.amazonaws.com', 5432, nil, nil, 'd66aimi70ef5kg', 'dtrodkftrfqyyg', 'Ye8IKyxUWHah2s6Ca_QZ0lbzkO')


#require 'data_mapper'

#DataMapper.setup(:default, ENV['DATABASE_URL'] || 'postgres://localhost/mydb')

use Rack::SSL

use Rack::Static, :urls => ['/static']
get '/' do
  @elements = element('circle','sandbox')
  erb:index
end

def element(object,level)
  element = ''
  res=$conn.exec('select * from '+object+' where id=sandbox')
  rows = res.ntuples()
  fields = res.fields()
  (0...rows).each do |i|
  	element += '<'+object
  	(fields).each do |field|
      element+=' '+feild+'="'+res[i][feild]+'"'
    end
    element += '/>'
  end
  return element
end
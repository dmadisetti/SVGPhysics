require 'openssl'
require 'sinatra'
require 'rack/ssl'
require 'pg'
$conn = PGconn.connect('ec2-54-243-137-0.compute-1.amazonaws.com', 5432, nil, nil, 'ddpl842se5qjjt', 'sukikabaqwhkeh', 'F-nDfTpy7QS5VJWidFd7K0W_3D')


#require 'data_mapper'

#DataMapper.setup(:default, ENV['DATABASE_URL'] || 'postgres://localhost/mydb')

use Rack::SSL

use Rack::Static, :urls => ['/static']
get '/' do
  @elements = element('circle','sandbox')
  @elements += element('rect','sandbox')
  erb:index
end


def element(object,level)
  element = ''
  res=$conn.exec("select * from "+object+" where class='sandbox'")
  rows = res.ntuples()
  puts "testing"
  fields = res.fields()
  (0...rows).each do |i|
  	element += '<'+object
  	(fields).each do |field|
  	  if field == 'type' || field == 'src'
        element+=' data-'+field+'="'+res[i][field].to_s+'"'
      elsif field == 'main'
        if res[i]['main']
          element+=' id="main"'
        end
      else
        element+=' '+field+'="'+res[i][field].to_s+'"'
      end
    end
    element +='stroke="black" stroke-width="2" fill="blue"/>'
  end
  return element
end
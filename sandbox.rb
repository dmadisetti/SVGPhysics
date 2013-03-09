require 'webrick'
require 'webrick/https'
require 'openssl'
require 'sinatra'
require 'rack/ssl'

use Rack::SSL

class Server  < Sinatra::Base
    use Rack::Static, :urls => ["/static"]
    get '/' do
      erb:index
    end            
end



webrick_options = {
  :Port               => 443,
  :Logger             => WEBrick::Log::new($stderr, WEBrick::Log::DEBUG),
  :SSLEnable          => true,
  :SSLVerifyClient    => OpenSSL::SSL::VERIFY_NONE,
  :SSLCertificate     => OpenSSL::X509::Certificate.new(  File.open("cert").read),
  :SSLPrivateKey      => OpenSSL::PKey::RSA.new(          File.open("key").read),
  :SSLCertName        => [ [ "CN",WEBrick::Utils::getservername ] ],
  :app                => Server
}

Rack::Server.start webrick_options
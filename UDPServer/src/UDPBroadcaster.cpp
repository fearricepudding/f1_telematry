#include <algorithm>
#include <cstdlib>
#include <deque>
#include <iostream>
#include <set>
#include <string>
#include <boost/bind.hpp>
#include <boost/shared_ptr.hpp>
#include <boost/enable_shared_from_this.hpp>
#include <boost/asio.hpp>

#include "UDPBroadcaster.h"

using boost::asio::ip::tcp;
using boost::asio::ip::udp;

UDPBroadcaster::UDPBroadcaster(boost::asio::io_service& io_context, const udp::endpoint& broadcast_endpoint): socket_(io_context){
	socket_.connect(broadcast_endpoint);
	socket_.set_option(udp::socket::broadcast(true));
}

void UDPBroadcaster::deliver(const std::string& msg){
	boost::system::error_code ignored_ec;
	socket_.send(boost::asio::buffer(msg), 0, ignored_ec);
}
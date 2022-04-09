#ifndef H_UDPBROADCASTER
#define H_UDPBROADCASTER

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

#include "TCPSubscriber.h"

using boost::asio::ip::tcp;
using boost::asio::ip::udp;

class UDPBroadcaster: public TCPSubscriber{
public:
	UDPBroadcaster(boost::asio::io_service& io_context, const udp::endpoint& broadcast_endpoint);

private:
	void deliver(const std::string& msg);
	udp::socket socket_;
};

#endif
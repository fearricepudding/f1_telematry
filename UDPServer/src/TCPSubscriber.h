#ifndef H_TCPSUBSCRIBER
#define H_TCPSUBSCRIBER

class TCPSubscriber{
public:
	virtual ~TCPSubscriber(){};
	virtual void deliver(const std::string& msg) = 0;
};

typedef boost::shared_ptr<TCPSubscriber> subscriber_ptr;

#endif
// #ifndef H_TCPTHREAD
// #define H_TCPTHREAD

// #include <boost/thread.hpp>
// #include "udpServer.h"

// class UDPThread{
// public: 
// 	UDPThread();
// 	~UDPThread();
// 	void start();
// 	void stop();
//     static void callback(std::string);
// 	boost::mutex m_mustStopMutex;
// 	boost::thread* m_thread; 	
	
// private:
// 	void loop();
// 	void listen();
// 	bool m_stop;
// 	//UDPServer *udpsrv = new UDPServer();

// };

// #endif
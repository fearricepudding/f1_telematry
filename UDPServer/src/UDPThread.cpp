// #include <boost/thread.hpp>
// #include <boost/asio.hpp>
// #include <iostream>
// #include <string>
// #include <sys/types.h>

// #include "UDPThread.h"
// #include "UDPServer.h"

// UDPThread::UDPThread(){
// 	m_thread = NULL;
// 	m_stop = false;
// }

// UDPThread::~UDPThread(){};


// void UDPThread::listen(){
// 	//udpsrv->listen();
// }

// void UDPThread::start(){
// 	m_mustStopMutex.lock();
// 	m_stop = false;
// 	m_mustStopMutex.unlock();
// 	m_thread = new boost::thread(&UDPThread::loop, this);
// }

// void UDPThread::stop(){
// 	m_mustStopMutex.lock();
// 	m_stop = true;
// 	m_mustStopMutex.unlock();
// 	if(m_thread!=NULL){
// 		m_thread->join();
// 	}
// }

// void UDPThread::loop(){
// 	bool mustStop = false;
// 	while(!mustStop){
// 		listen();
// 		m_mustStopMutex.lock();
// 		mustStop = m_stop;
// 		m_mustStopMutex.unlock();
// 	}
// }
#ifndef UDPSERVER_H_INCLUDED
#define UDPSERVER_H_INCLUDED

#include <functional>
#include <stdio.h> 
#include <iostream>
#include <stdlib.h> 
#include <unistd.h> 
#include <string.h> 
#include <sys/types.h> 
#include <sys/socket.h> 
#include <arpa/inet.h> 
#include <netinet/in.h> 
#include <boost/thread.hpp>

#include <telematry.h>

#include "../../data_types/header.h"
#include "../../data_types/CarStatusData.h"
#include "../../data_types/CarTelemData.h"
#include "../../data_types/EventData.h"
#include "../../data_types/LapData.h"
#include "../../data_types/MotionData.h"
#include "../../data_types/SessionData.h"

#define PORT    2222 
#define MAXLINE 2048 

class UDPServer {
public:
	UDPServer(Telematry*);
	~UDPServer();
	void listen();
private:
    Telematry *telematry;
    void send(char* message);
    template <typename packet>
	int recieve(packet);
	struct sockaddr_in servaddr, cliaddr;
	int sockfd;
	char buffer[MAXLINE];
    void update();
};

#endif

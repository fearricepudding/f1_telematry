#include "telematry.h"
#include<Websocket.h>
#include<UDPServer.h>

int main(){
    Telematry *telematry = new Telematry();
	UDPServer *udp = new UDPServer(telematry);
    Websocket *ws = new Websocket();
    std::string docroot;

    //ws->run(docroot, 9002, 1000);
    udp->listen();
	return 0;
}

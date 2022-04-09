
#include "UDPServer.h"

UDPServer::UDPServer(Telematry *telematryPtr) {
    telematry = telematryPtr;
}
UDPServer::~UDPServer() {};

void UDPServer::listen() {

    // Creating socket file descriptor 
    if ((sockfd = socket(AF_INET, SOCK_DGRAM, 0)) < 0) {
        std::cout << "Socket creation failed" << std::endl;
        exit(EXIT_FAILURE);
    }

    memset(&servaddr, 0, sizeof(servaddr));
    memset(&cliaddr, 0, sizeof(cliaddr));

    // Filling server information 
    servaddr.sin_family = AF_INET; // IPv4 
    servaddr.sin_addr.s_addr = INADDR_ANY;
    servaddr.sin_port = htons(PORT);

    // Bind the socket with the server address 
    if (bind(sockfd, (const struct sockaddr*)&servaddr,
        sizeof(servaddr)) < 0) {
        std::cout << "Error occured binding port" << std::endl;
        exit(EXIT_FAILURE);
    }

    update();
}

void UDPServer::update(){
    // struct PacketCarStatusData pcsd; 
    struct PacketCarTelemetryData pctd;
    //recieve(&pcsd);
    int status = recieve(&pctd);
    //telematry->carStatus = pcsd;
    if(status == 0){
        telematry->carTelem = pctd;
        unsigned int pos = (unsigned int)pctd.m_header.m_playerCarIndex;
        std::cout << "POS: " << (unsigned int)pctd.m_header.m_playerCarIndex << std::endl;
        //std::cout << "RPM: " << (unsigned int)pctd.m_carTelemetryData[pos].m_engineRPM << std::endl;
        telematry->update();
        std::cout << "---------" << std::endl;
    }
    update();
};

template <typename packet>
int UDPServer::recieve(packet pkt) {

    int n;
    socklen_t len;
    len = sizeof(cliaddr);
    n = recvfrom(sockfd,
        pkt,
        MAXLINE,
        MSG_WAITALL, (struct sockaddr*)&cliaddr,
        &len);

    if(unsigned(pkt->m_header.m_packetId) != 6)
        return 1;
    std::cout << "PKT ID: " << unsigned(pkt->m_header.m_packetId) << std::endl;
    return 0;
}

void UDPServer::send(char* message) {
    int n;
    socklen_t len;
    len = sizeof(cliaddr);  //len is value/resuslt 
    sendto(sockfd, (const char*)message, strlen(message),
        true, (const struct sockaddr*)&cliaddr,
        len);
}


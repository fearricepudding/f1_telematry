#pragma once

#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>

#include <fstream>
#include <iostream>
#include <set>
#include <streambuf>
#include <string>

class Websocket{
public:
    typedef websocketpp::connection_hdl connection_hdl;
    typedef websocketpp::server<websocketpp::config::asio> server;

    Websocket();
    void run(std::string, uint16_t, int);
    void set_timer();
    void on_timer(websocketpp::lib::error_code const &);
    void on_http(connection_hdl);
    void on_open(connection_hdl);
    void on_close(connection_hdl);

private:
    typedef std::set<connection_hdl,std::owner_less<connection_hdl>> con_list;
    server m_endpoint;
    con_list m_connections;
    server::timer_ptr m_timer;
    int m_timeout;
    
    std::string m_docroot;
    
    // Telemetry data
    uint64_t m_count;
};
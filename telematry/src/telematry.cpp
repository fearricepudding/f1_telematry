#include "telematry.h"
#include <cstdint>
#include <iostream>

void Telematry::update(){

    int pos = unsigned(carTelem.m_header.m_playerCarIndex);
    // std::cout << unsigned(carTelem.m_carTelemetryData[pos].m_engineRPM) << std::endl;
    // std::cout << signed(carTelem.m_carTelemetryData[pos].m_gear) << std::endl;
};

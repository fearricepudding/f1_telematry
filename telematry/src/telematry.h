#pragma once

#include <string>

#include "../../data_types/header.h"
#include "../../data_types/CarStatusData.h"
#include "../../data_types/CarTelemData.h"
#include "../../data_types/EventData.h"
#include "../../data_types/LapData.h"
#include "../../data_types/MotionData.h"
#include "../../data_types/SessionData.h"

class Telematry {
public:
    void start();
    void update();
    PacketCarStatusData carStatus;
    PacketCarTelemetryData carTelem;
};
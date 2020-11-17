cmake_minimum_required( VERSION 3.8 )

project( server )

set( CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/bin )
set( CMAKE_EXPORT_COMPILE_COMMANDS ON )

file( GLOB SRC_FILES ${PROJECT_SOURCE_DIR}/src/*.c )
add_executable( server ${SRC_FILES} )
    
target_link_libraries( server )

target_include_directories( server PRIVATE ${CMAKE_SOURCE_DIR}/${COMMON_INCLUDE_DIR} )

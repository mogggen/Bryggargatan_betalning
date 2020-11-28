#include "socket.h"
#include <stdio.h>

#ifdef WIN32

#include <sys/types.h>
#include <WinSock2.h>
#pragma comment(lib, "Ws2_32.lib")

#else

#include <sys/socket.h>

#endif
 
SOCKET create_socket(int af, int type, int protocol)
{
#ifdef WIN32
    struct WSAData wsa;
    if(WSAStartup(MAKEWORD(2,2), &wsa) != 0)
    {
        fprintf(stderr, "Failed to start WSA: %d\n", WSAGetLastError());
    }
#endif

    return socket(af, type, protocol);
}

void close_socket(SOCKET socket)
{
#ifdef WIN32
    shutdown(socket, SD_BOTH);
    closesocket(socket);
    WSACleanup();
#else
    close(socket);
#endif
}

char socket_has_received_data(SOCKET socket)
{
#ifdef WIN32
    unsigned long l;
    int r = ioctlsocket(socket, FIONREAD, &l);

    if (r == 0 && l > 0)
        return 1;
    else
        return 0;

#else
    char b;
    int received_bytes = recv(socket, &b, 1, MSG_PEEK | MSG_DONTWAIT);

    if (received_bytes <= 0)
        return 0;
    else
        return 1;
#endif
}

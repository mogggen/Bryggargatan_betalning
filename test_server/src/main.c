#include <stdio.h>
#include "socket.h"

#define BUF_SIZE 4096

int main(int argc, char** argv)
{
    printf("Hello there!\n");

    SOCKET listening_socket = create_socket(AF_INET, SOCK_STREAM, 0);
    if (listening_socket == SOCKET_ERROR)
    {
        fprintf(stderr, "Failed to create socket. ");
        print_socket_error();
        return false;
    }

    struct sockaddr_in server_addr;
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(9002);
    server_addr.sin_addr.s_addr = INADDR_ANY;

    if(bind(listening_socket, (struct sockaddr*)&server_addr, sizeof(server_addr)) == SOCKET_ERROR)
    {
        fprintf(stderr, "<!> Failed to bind socket. ");
        print_socket_error();
        return false;
    }

    if(listen(listening_socket, 10))
    {
        fprintf(stderr, "<!> Failed to listen on socket. ");
        print_socket_error();
        return false;
    }
    printf("<> Started to listen...\n");
    char buf[BUF_SIZE];

    while(true)
    {
    
        SOCKET client_socket = accept(listening_socket, NULL, NULL);
        if(client_socket == SOCKET_ERROR)
        {
            printf("<!> Failed to accept ");
            print_socket_error();
            continue;
        }

        printf("<> Client connected\n");
        while(true)
        {
            int read_bytes = recv(client_socket, buf, BUF_SIZE, 0);

            if(read_bytes == SOCKET_ERROR)
            {
                printf("<!> Failed to read.\n");
                print_socket_error();
                break;
            }
            if(read_bytes == 0)
                break;

            int i = BUF_SIZE > read_bytes ? read_bytes : BUF_SIZE-1;
            buf[i] = '\0';
            printf("%s\n", buf);

                //Host: localhost:9002\n
            char* response_msg = "HTTP/1.1 200OK\nServer: MeMyselfAndI\nAccess-Control-Allow-Origin: *\nContent-Type: text/plain;charset=UTF-8\nContent-Length: 18\nConnection: close\n\nHello typescript!\0";
            int len = strlen(response_msg);
            response_msg[len-1] = 4;
            send(client_socket, response_msg, len+1, 0);
        }

        shutdown(client_socket, SD_BOTH);
        printf("<> Client dissconnected\n");
    }

    close_socket(listening_socket);

    return 0;
}

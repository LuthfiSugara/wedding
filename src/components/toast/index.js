'use client'

import React from 'react'
import { CloseIcon } from '@chakra-ui/icons'
import { Box, Flex, Icon, Image, Stack, Text, useToast } from '@chakra-ui/react'
import { CheckSuccess } from '../../assets/icons'

const Index = () => {
    const toast = useToast()

    const createToast = (
        title,
    ) => {
        toast({
            title: title,
            description: '',
            status: 'success',
            duration: 9000,
            isClosable: true,
            position: 'top-right',
            render: () => (
                <Box bg={'#fdfdfd'} p={1} rounded={'md'}>
                    <Stack justify={'space-between'} direction={'row'} color='black' bg='white' className='rounded-md' boxShadow={'xl'} rounded={'md'}>
                        <Flex align={'center'} gap={4}>
                            <Box width={10} height={10} position={'relative'} display={'block'}>
                                <Image
                                    src={CheckSuccess}
                                    alt='toast'
                                    width={10}
                                    height={10}
                                    style={{objectFit: 'cover'}}
                                />
                            </Box>
                            <Box>
                                <Text fontWeight={'semibold'}>{title}</Text>
                            </Box>
                        </Flex>
                        <Icon 
                            as={CloseIcon}
                            boxSize={3} 
                            color={'gray.400'}
                            cursor={'pointer'}
                            onClick={() => {toast.closeAll()}}
                        />
                    </Stack>
                </Box>
            ),
        })
    }

    return { createToast }
}

export default Index
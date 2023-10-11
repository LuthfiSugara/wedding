import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { BCA, BNI, Background, Flower1, Man, Scooter, WeddingCouple, Woman } from '../../assets';
import { Box, Button, Center, Grid, GridItem, HStack, Image, Input, SimpleGrid, Spinner, Stack, Text, Textarea, VStack } from '@chakra-ui/react';
import { Calendar, Clock, Copy, Envelope, Pause, Play } from '../../assets/icons';
import { copyText, useCountdown } from '../../hooks';
import { Toast } from '../../components';
import { useFormik } from 'formik'
import * as Yup from "yup";
import { Music } from '../../assets/music';
import { useInView } from 'react-intersection-observer';
import { fetchMessages } from '../../features/message';
import { API } from '../../config/api';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

const Index = () => {
    const location = useLocation();
    // console.log('location : ', location.pathname.replace("/", ""));
    const LIMIT = 3;
    const { createToast } = Toast();
    const { ref, inView } = useInView();

    const queryClient = useQueryClient();

    const [step, setStep] = useState(0),
    [isPlaying, setIsplaying] = useState(false),
    [page, setPage] = useState(1),
    [loadAction, setLoadAction] = useState(false);

    const song = useRef(new Audio(Music));

    const toggleAudio = () => {
      if(isPlaying){
        setIsplaying(false)
        song.current.pause();
      }else{
        setIsplaying(true);
        song.current.loop = true;
        song.current.play();
      }
    }

    const {days, hours, minutes, seconds} = useCountdown('2023-11-18 08:00:00');

    const {
      status,
      data,
      error,
      isFetching,
      isFetchingNextPage,
      fetchNextPage,
      hasNextPage,
      refetch,
    } = useInfiniteQuery(
      "list-messages",
      async ({ pageParam = 1 }) => {
        const res = await API.get(
          `/wedding-messages?page=${pageParam}&limit=${LIMIT}`
        );
  
        console.log("messages : ", res.data);
        return res.data;
      },
      {
        getNextPageParam: (lastPage) => {
          console.log('lastpage : ', lastPage)
          if (
            Number(lastPage.metadata.current_page) < Number(lastPage.metadata.total_pages)
          ) {
            return Number(lastPage.metadata.current_page) + 1;
          }
        },
      }
    );

    useEffect(() => {
      if (inView) {
        fetchNextPage();
      }
    }, [inView]);

    console.log('data msg : ', data)

    const {
      handleSubmit,
      setFieldValue,
      errors,
      values,
      touched,
      isValid,
      resetForm,
  } = useFormik({
      initialValues: {
          name: "",
          description: "",
      },
      validationSchema: Yup.object({
          name: Yup.string().required("Mohon isi nama anda"),
          description: Yup.string().required("Mohon isi ucapan untuk kedua mempelai"),
      }),
      onSubmit: async (values) => {
        console.log('values bundle : ', values);
        onSubmit(values);
      },
  });

  const apiCreateMessage = async (data) => {
    const res = await API.post("/create-message", data);
    return res;
  };

  const handleCreateMsg = useMutation({
    mutationKey: ["create-message"],
    mutationFn: apiCreateMessage,
    onMutate: async (newTodo) => {
      setLoadAction(true);
    },
    onError: (error, variables, context) => {
      console.log('error : ', error);
      setLoadAction(false);
      createToast('Pesan gagal dikirim', "error", "", "bottom-right");
    },
    onSettled: () => {
      setLoadAction(false);
    },
    onSuccess: (success) => {
      console.log('success : ', success);
      queryClient.refetchQueries({ queryKey: ["list-messages"]});
      setLoadAction(false);
      if(success.data.status.toLowerCase() == 'success'){
        createToast('Pesan berhasil dikirim', "success", "", "bottom-right");
        resetForm();
      }else{
        createToast('Pesan gagal dikirim', "error", "", "bottom-right");
      }
    },
  });

  const onSubmit = async (data) => {
    await handleCreateMsg.mutate(data);
  };
    
  return (
    <Box
        style={{
            // backgroundImage: `url(${Background})`,
            // backgroundPosition: 'center',
            // backgroundSize: 'cover',
            // backgroundRepeat: 'no-repeat',
            background: 'black',
            width: '100vw',
            height: 'auto'
        }}
        color={'white'}
    >
      {step == 0 ? (
          <HStack justify={'center'}  width={['95%']} mx={'auto'} pt={{sm: 4, lg: 0 }} pb={{ sm: 8, lg: 0 }}>
            <VStack justify={'center'} width={'full'} height={['100vh', 'auto', '100vh']}>
              {/* <Text fontWeight={'bold'} fontSize={'4xl'} mb={4} textAlign={'center'}>بِسْــــــــــــــــــمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ</Text> */}
              {/* <Text fontWeight={'bold'} fontSize={'6xl'} mb={4} textAlign={'center'} className='font-great' casing={'capitalize'}>Assalamu’alaikum Warahmatullahi Wabarakatuh</Text> */}
              <Text fontWeight={'bold'} fontSize={['4xl', '6xl']} mt={4} textAlign={'center'} className='font-great' casing={'capitalize'}>Undangan Pernikahan</Text>
              <HStack justify={'center'}>
                <Box position={'relative'} display={'block'} width={['75%', '50%']}>
                  <Image src={WeddingCouple} width={'100%'} objectFit={'cover'} />
                </Box>
              </HStack>
              <Stack
                gap={6}
                direction={{lg: 'row'}}
              >
                <Text 
                  mt={4}
                  fontSize={['4xl', '6xl']} 
                  fontWeight={'bold'}
                  textAlign={'center'}
                  className='font-great'
                >
                  Luthfi
                </Text>
                <Text 
                  mt={4}
                  fontSize={['4xl', '6xl']} 
                  fontWeight={'bold'}
                  textAlign={'center'}
                  className='font-great'
                >
                  &
                </Text>
                <Text 
                  mt={4}
                  fontSize={['4xl', '6xl']} 
                  fontWeight={'bold'}
                  textAlign={'center'}
                  className='font-great'
                >
                  Endang
                </Text>
              </Stack>
              <Text fontSize={['md', 'md']} fontWeight={'semibold'} mt={4}>Kpd Bpk/Ibu/Saudara/i</Text>
              <Text fontSize={['xl', '2xl']} fontWeight={'bold'} my={2}>Nama Tamu Undangan</Text>
              <Text 
                mt={2} 
                fontWeight={'semibold'} 
                fontSize={['xs', 'lg']}
                width={['95%', '95%', '50%']} 
                textAlign={'center'}
              >
                Merupakan suatu kehormatan bagi kami, apabila bapak/ibu/saudara/i berkenan hadir untuk memberikan do'a restu kepada Kami.
              </Text>
              <Button
                mt={[4, 4]}
                color={'white'}
                background={'#e37811'}
                _hover={{ background: '#a55a13' }}
                onClick={() => {
                  setStep(1)
                  toggleAudio();
                }}
              >
                <Image src={Envelope} /> 
                <Text ml={2}>Buka Undangan</Text>
              </Button>
            </VStack>
          </HStack>
      ): (
        <Box>
          <Box
            p={2}
            right={0}
            top={'50%'}
            bg={'#e37811'}
            position={'fixed'}
            cursor={'pointer'}
            borderLeftRadius={'50%'}
            onClick={() => {
              toggleAudio();
            }}
          >
            {isPlaying ? (
              <Image src={Pause} alt='Pause' />
            ) : (
              <Image src={Play} alt='play' />
            )}
            <audio loop muted autoPlay id="videomain">
              <source src={Music} type="audio/mp3"></source>
            </audio>
          </Box>
          <Box
            style={{
              // backgroundImage: `url(${Background})`,
              // backgroundPosition: 'center',
              // backgroundSize: 'cover',
              // backgroundRepeat: 'no-repeat',
              background: 'black',
              width: '100vw',
              height: '100vh'
            }}
          >
            {/* section 1 */}
            <VStack height={['100vh', 'auto']} justify={'center'} width={'95%'} mx={'auto'} pt={{sm: 4, lg: 0 }} pb={{ sm: 8, lg: 0 }}>
              <Text 
                color={'white'} 
                fontWeight={'bold'} 
                textAlign={'center'}
                fontSize={['xl', '2xl', '5xl']} 
              >
                Save the date
              </Text>
              <Text 
                mb={4}
                color={'white'} 
                fontWeight={'bold'} 
                textAlign={'center'}
                fontSize={['xl', '2xl',  '3xl']} 
              >
                Wedding Invitation
              </Text>
              <Box position={'relative'} display={'block'} width={['90%', '55%', '20%', '35%']}>
                <Image src={WeddingCouple} width={'100%'} objectFit={'cover'} />
              </Box>
              <Stack gap={{sm: 4, lg: 6}} textAlign={'center'} direction={{sm: 'col', lg: 'row'}} align={'center'}>
                <Text fontSize={['4xl', '5xl', '6xl']} fontWeight={'bold'} className='font-great'>Luthfi</Text>
                <Text fontSize={['3xl', '4xl', '5xl']} fontWeight={'bold'} className='font-great'>&</Text>
                <Text fontSize={['4xl', '5xl', '6xl']} fontWeight={'bold'} className='font-great'>Endang</Text>
              </Stack>
              <Box textAlign={'center'} fontWeight={'bold'} mt={4}>
                <Text fontSize={['md', 'xl']} p={0} m={0}>Sabtu</Text>
                <Text fontSize={['lg', 'xl']} p={0} m={0}>18 November 2023</Text>
              </Box>

              <HStack width={['90%', '75%', '50%']} mt={5}>
                <SimpleGrid columns={[4, 4]} spacing={2} width={'100%'}>
                  <Box bg={'#d99452'} width={'full'} textAlign={'center'} color={'white'} borderRadius={'lg'} p={2}>
                    <Text fontSize={['lg', 'xl']} fontWeight={'bold'}>{days}</Text>
                    <Text fontSize={['xs', 'xl']} fontWeight={'semibold'}>Hari</Text>
                  </Box>
                  <Box bg={'#d99452'} width={'full'} textAlign={'center'} color={'white'} borderRadius={'lg'} p={2}>
                    <Text fontSize={['lg', 'xl']} fontWeight={'bold'}>{hours}</Text>
                    <Text fontSize={['sm', 'xl']} fontWeight={'semibold'}>Jam</Text>
                  </Box>
                  <Box bg={'#d99452'} width={'full'} textAlign={'center'} color={'white'} borderRadius={'lg'} p={2}>
                    <Text fontSize={['lg', 'xl']} fontWeight={'bold'}>{minutes}</Text>
                    <Text fontSize={['sm', 'xl']} fontWeight={'semibold'}>Menit</Text>
                  </Box>
                  <Box bg={'#d99452'} width={'full'} textAlign={'center'} color={'white'} borderRadius={'lg'} p={2}>
                    <Text fontSize={['lg', 'xl']} fontWeight={'bold'}>{seconds}</Text>
                    <Text fontSize={['sm', 'xl']} fontWeight={'semibold'}>Detik</Text>
                  </Box>
                </SimpleGrid>
              </HStack>

              <Button
                mt={8}
                color={'white'}
                rounded={'2xl'}
                background={'#d99452'}
                _hover={{ background: '#e7af7a' }}
                onClick={() => {
                  window.open("https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=MGI3NWMwcTZjbzZudGs5NmhrbzUwYWdvZ2sgc3VnYXJhbHV0aGZpQG0&tmsrc=sugaraluthfi%40gmail.com");
                }}
              >
                <Image src={Clock} /> 
                <Text ml={2}>Ingatkan Saya</Text>
              </Button>
            </VStack>
          </Box>

          {/* section 2 */}
          <Box
            style={{
              // backgroundImage: `url(${Background})`,
              // backgroundPosition: 'center',
              // backgroundSize: 'cover',
              // backgroundRepeat: 'no-repeat',
              background: 'black',
              width: '100vw',
              // height: '100vh'
            }}
            height={['auto']}
          >
            <HStack justify={'center'} px={[2]} pt={[12]} pb={8}>
              <VStack height={['auto', 'auto', '100vh']} width={'97%'} justify={'center'} align={'center'}>
                <Text fontWeight={'bold'} fontSize={['2xl', '4xl']} mb={4} textAlign={'center'}>بِسْــــــــــــــــــمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ</Text>
                <Text
                  mb={8}
                  fontSize={['md', 'xl', 'xl', '2xl']}
                  fontWeight={'bold'}
                  textAlign={'center'}
                  width={['98%', '95%', '75%', '50%']}
                >
                  Dengan Memohon Rahmat Dan Ridho Dari Allah SWT. Kami Bermaksud Menyelenggarakan Syukuran Pernikahan Putra Putri Kami
                </Text>
                <HStack justify={'center'}>
                <Grid 
                  templateRows={['repeat(1, 1fr)', 'repeat(1, 1fr)']}
                  templateColumns={['repeat(11, 1fr)', 'repeat(11, 1fr)']}
                  gap={6}
                  mx={'auto'}
                >
                  <GridItem w='100%' colSpan={[11, 11, 5]} align={'center'}>
                    <Box textAlign={'center'}>
                      <HStack justify={'center'} mb={6}>
                        <Box width={['25%']} position={'relative'} display={'block'}>
                          <Image src={Man} objectFit={'cover'} width={'100%'} />
                        </Box>
                      </HStack>
                      <Text fontSize={['2xl', '4xl']} fontWeight={'bold'} className='font-great'>Muhammad Luthfi Sugara Nasution. S.Kom</Text>
                      <Text fontSize={['sm', 'lg']} fontWeight={'bold'} mt={4}>Anak Dari : </Text>
                      <Text fontSize={['md', 'xl']} fontWeight={'bold'}>Bapak Zulhelmi Nasution & Ibu Derhinun Harahap</Text>
                    </Box>
                  </GridItem>
                  <GridItem w='100%' colSpan={[11, 11, 1]} align={'center'}>
                    <VStack justify={'center'} height={['', 'full']}>
                      <Text fontSize={'4xl'} fontWeight={'bold'} className='font-great'>L & E</Text>
                    </VStack>
                  </GridItem>
                  <GridItem w='100%' colSpan={[11, 11, 5]} align={'center'}>
                    <Box textAlign={'center'}>
                      <HStack justify={'center'} mb={10}>
                        <Box width={'25%'} position={'relative'} display={'block'}>
                          <Image src={Woman} objectFit={'cover'} width={'100%'} />
                        </Box>
                      </HStack>
                      <Text fontSize={['2xl', '4xl']} fontWeight={'bold'} className='font-great'>Endang Syuarda. AMD</Text>
                      <Text fontSize={['sm', 'lg']} fontWeight={'bold'} mt={4}>Anak Dari : </Text>
                      <Text fontSize={['md', 'xl']} fontWeight={'bold'}>Bapak Purn TNI AD Enjan (Alm) & Ibu Katimah</Text>
                    </Box>
                  </GridItem>
                  </Grid>
                </HStack>
              </VStack>
            </HStack>
          </Box>

          {/* Section 3 */}
          <Box
             style={{
              // backgroundImage: `url(${Background})`,
              // backgroundPosition: 'center',
              // backgroundSize: 'cover',
              // backgroundRepeat: 'no-repeat',
              background: 'black',
              width: '100vw',
              height: 'auto'
            }}
          >
            <HStack justify={'center'} fontWeight={'bold'}>
              <VStack height={['auto', '100vh']} width={'90%'} justify={'center'} fontWeight={'bold'} textAlign={'center'} pt={12} pb={8}>
                <Box textAlign={'center'}>
                  <Text fontSize={['lg', '2xl']}>Insyaallah Acara Akan Dilaksanan Pada : </Text>
                  <Text fontSize={['3xl', '4xl']} className='font-great' mt={10}>Akad Nikah</Text>
                  <HStack justify={'center'} mt={4}>
                    <Box gap={16}>
                      <HStack align={'center'} mb={2}>
                        <Image src={Calendar} alt='calendar' />
                        <Text fontSize={['md', 'lg']}>Sabtu, 18 November 2023</Text>
                      </HStack>
                      <HStack align={'center'}>
                        <Image src={Clock} alt='calendar' />
                        <Text fontSize={['md', 'lg']}>Pukul : 08:00 WIB - Selesai</Text>
                      </HStack>
                    </Box>
                  </HStack>
                  <Box mt={4} fontSize={['sm', 'md']} fontWeight={'bold'}>
                    <Text>Bertempat Di Masjid Al-Falah</Text>
                    <Text>Jl. Kesatria, Asrama Kodim 0204/DS Kec. Padang Hilir (Barak Duku II ) - Tebing Tinggi</Text>
                  </Box>
                </Box>
                <Box mt={12}>
                  <Text fontSize={['3xl', '4xl']} className='font-great'>Resepsi</Text>
                  <HStack justify={'center'}>
                    <Box>
                      <HStack align={'center'} mb={2}>
                        <Image src={Calendar} alt='calendar' />
                        <Text fontSize={['md', 'lg']}>Sabtu, 18 November 2023</Text>
                      </HStack>
                      <HStack align={'center'}>
                        <Image src={Clock} alt='calendar' />
                        <Text fontSize={['md', 'lg']}>Pukul : 08:00 WIB - Selesai</Text>
                      </HStack>
                    </Box>
                  </HStack>
                  <Box mt={4} fontSize={['sm', 'md']} fontWeight={'bold'}>
                    <Text>Bertempat Di Kediaman Mempelai Wanita</Text>
                    <Text fontWeight={'semibold'}>Jl. Kesatria, Asrama Kodim 0204/DS Kec. Padang Hilir (Barak Duku II ) - Tebing Tinggi</Text>
                  </Box>
                </Box>

                <Box my={2} width={'100%'}>
                  <HStack justify={'center'}>
                    <Box width={['100%', '505%', '35%']}>
                      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d250.32691824289753!2d99.17310447498484!3d3.3322602496367257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x303161e68c07ffeb%3A0x29e5274469712fcc!2sKedai%20kui%20tebing%20tinggi!5e0!3m2!1sen!2sid!4v1696303955563!5m2!1sen!2sid" width="100%" height="300" style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </Box>
                  </HStack>
                  <Button
                    mt={4}
                    size={'sm'}
                    color={'white'}
                    background={'#d99452'}
                    _hover={{ background: '#e7af7a' }}
                    onClick={() => {
                      window.open('https://maps.app.goo.gl/ajcYDCnPwFxecL9b9')
                    }}
                  >
                    Lihat Lokasi
                  </Button>
                </Box>
              </VStack>
            </HStack>
          </Box>

          {/* Section 4 */}
          <Box
            style={{
              // backgroundImage: `url(${Background})`,
              // backgroundPosition: 'center',
              // backgroundSize: 'cover',
              // backgroundRepeat: 'no-repeat',
              background: 'black',
              width: '100vw',
              // height: '100vh'
            }}
            height={['auto', '100vh']}
          >
            <HStack justify={'center'} fontWeight={'bold'}>
              <VStack height={['auto', '100vh']} justify={'center'} pt={12} pb={8}>
                  <Text textAlign={'center'} fontSize={['4xl', '5xl', '6xl']} fontWeight={'bold'} className='font-great'>Wedding Gift</Text>
                  <Text fontSize={['md', 'lg', 'xl']} textAlign={'center'} width={['100%', '100%', '50%']} mt={8}>Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.</Text>
                  <HStack justify={'center'} mt={8}>
                    <Box align={'center'}>
                      <Box position={'relative'} display={'block'} width={['50%', '25%', '15%']}>
                        <Image src={BCA} alt='bni' style={{ objectFit: 'cover', width: '100%' }} />
                      </Box>
                      <Text fontSize={['sm', 'md', 'xl']} mt={4}>Transfer Ke Rekening BCA a.n</Text>
                      <Text fontSize={['lg', 'xl']} fontWeight={'bold'} mt={2}>Muhammad Luthfi Sugara Nasution</Text>
                      <Text fontSize={['md', 'lg']} fontWeight={'bold'} mt={1}>( 8205283044 )</Text>
                      <Button
                        mt={4}
                        color={'white'}
                        background={'#d99452'}
                        fontWeight={'bold'}
                        _hover={{ background: '#e7af7a' }}
                        onClick={() => {
                          createToast('Copied');
                          copyText('8205283044')
                        }}
                      >
                        <Image src={Copy} alt='copy' mr={2} />
                        <Text ml={1}>Copy No Rekening</Text>
                      </Button>
                    </Box>
                  </HStack>
                  <HStack justify={'center'} mt={8}>
                    <Box align={'center'}>
                      <Box position={'relative'} display={'block'} width={['50%', '25%', '20%']}>
                        <Image src={BNI} alt='bni' style={{ objectFit: 'cover', width: '100%' }} />
                      </Box>
                      <Text fontSize={['sm', 'md', 'xl']} mt={2}>Transfer Ke Rekening BNI a.n</Text>
                      <Text fontSize={['lg', 'xl']} mt={2}>Endang Syuarda</Text>
                      <Text fontSize={['md', 'lg']} mt={1} fontWeight={'bold'}>( 0380683810 )</Text>
                      <Button
                        mt={4}
                        color={'white'}
                        fontWeight={'bold'}
                        background={'#d99452'}
                        _hover={{ background: '#e7af7a' }}
                        onClick={() => {
                          createToast('Copied');
                          copyText('0380683810')
                        }}
                      >
                        <Image src={Copy} alt='copy' mr={2} />
                        <Text ml={1}>Copy No Rekening</Text>
                      </Button>
                    </Box>
                  </HStack>
              </VStack>
            </HStack>
          </Box>

          {/* Section 5 */}
          <Box
            style={{
              // backgroundImage: `url(${Background})`,
              // backgroundPosition: 'center',
              // backgroundSize: 'cover',
              // backgroundRepeat: 'no-repeat',
              background: 'black',
              width: '100vw',
              height: '100vh'
            }}
          >
            <HStack justify={'center'}>
              <VStack height={'100vh'} width={['950%', '850%', '75%', '60%', '50%']} justify={'center'} textAlign={'center'} color={'black'}>
                  <Text fontSize={['xl', '2xl']} fontWeight={'bold'} mb={4} color={'white'}>Kirim Pesan Untuk Kedua Mempelai</Text>
                  <Box width={'95%'} bg={'#f3eeea'} p={4} rounded={'lg'}>
                    <Box mb={4}>
                      <Text textAlign={'start'} fontWeight={'semibold'}>Nama <span style={{color: 'red'}}>*</span></Text>
                      <Input 
                        name='title' 
                        value={values.name}
                        background={'white'}
                        onChange={(e) => {
                          // console.log('title : ', e.target.value)
                          setFieldValue('name', e.target.value);
                        }}
                      />
                      {touched.name && errors.name && (
                        <Text fontSize={"xs"} color={"red.500"} textAlign={'start'}>
                            <>{errors.name}</>
                        </Text>
                      )}
                    </Box>
                    <Box mb={4}>
                      <Text textAlign={'start'} fontWeight={'semibold'} mb={1}>Ucapan & doa untuk kedua mempelai <span style={{color: 'red'}}>*</span></Text>
                      <Textarea 
                        name='description' 
                        background={'white'}
                        value={values.description}
                        onChange={(e) => {
                          setFieldValue('description', e.target.value);
                        }}
                      />
                      {touched.description && errors.description && (
                        <Text fontSize={"xs"} color={"red.500"} textAlign={'start'}>
                            <>{errors.description}</>
                        </Text>
                      )}
                    </Box>
                    <HStack justify={'end'}>
                      <Button
                        color={'white'}
                        align={'end'}
                        width={'full'}
                        background={'#d99452'}
                        _hover={{ background: '#e7af7a' }}
                        isLoading={loadAction}
                        onClick={() => {
                          handleSubmit()
                        }}
                      >
                        Kirim Ucapan
                      </Button>
                    </HStack>
                  </Box>

                  <Box width={'95%'} height={400} overflowY={'scroll'} bg={'#f3eeea'} p={2} mt={10} rounded={'lg'}>
                    <Text casing={'uppercase'} mx={6} my={4} textAlign={'start'} fontSize={'lg'} fontWeight={'bold'}>Ucapan & doa dari para undangan</Text>
                    {data &&
                    data.pages.map((page, indexPage) => (
                      <Box key={indexPage}>
                        {page.data.map((message, indexBundle) => (
                          <Box m={6}>
                           <Box className='arrow-up' ml={4}></Box>
                            <Box 
                              p={4}
                              mb={2} 
                              bg={'white'} 
                              rounded={'md'} 
                              width={'100%'} 
                              boxShadow={'md'}
                              textAlign={'start'}
                            >
                              <HStack justify={'space-between'}>
                                <Text color={'#d99452'} fontWeight={'bold'} mb={1} fontSize={'sm'}>{message.name}</Text>
                                <Text 
                                  color={'#d99452'} 
                                  fontWeight={'bold'}
                                  mb={1} 
                                  fontSize={'xs'}
                                >
                                  {formatDistanceToNow(
                                    new Date(message.created_at),
                                    {
                                      includeSeconds: true,
                                      addSuffix: true,
                                      locale: id
                                    }
                                  )}
                                </Text>
                              </HStack>
                              <Text fontWeight={'bold'} fontSize={['sm', 'md']}>{message.description}</Text>
                            </Box>
                          </Box>
                      ))}
                      </Box>
                    ))}
                    <HStack justify={"center"} pt={2} ref={ref}>
                      {isFetching && isFetchingNextPage && (
                        <Spinner
                          size="xl"
                          speed="0.85s"
                          thickness="4px"
                          color="gicv.primary"
                          emptyColor="gray.200"
                        />
                      )}
                    </HStack>
                  </Box>
              </VStack>
            </HStack>
          </Box>

          {/* Section 6 */}
          <Box
            bg={'black'}
            p={4}
          >
            <HStack justify={'center'}>
              <Box width={'95%'}>
                <Text fontWeight={'bold'} fontSize={['md', 'lg', 'xl']} textAlign={'center'} width={['95%', '95', '50%']} mx={'auto'}>Tiada Yang Dapat Kami Ungkapkan Selain Rasa Terimakasih Dari Hati Yang Tulus Apabila Bapak/ Ibu/ Saudara/i Berkenan Hadir Untuk Memberikan Do’a Restu Kepada Kami</Text>
                <HStack justify={'center'} my={8}>
                  <Box width={['75%', '60%', '30%']} position={'relative'} display={'block'} >
                    <Image src={Scooter} objectFit={'cover'} width={'100%'} />
                  </Box>
                </HStack>
                <Stack direction={['column', 'row']} justify={'center'} textAlign={'center'} fontWeight={'bold'} fontSize={['sm', 'lg']}>
                  <Text>Luthfi & Endang</Text>
                  <Text>18 November 2023</Text>
                </Stack>
              </Box>
            </HStack>
          </Box>

        </Box>
      )}
    </Box>
  )
}

export default Index
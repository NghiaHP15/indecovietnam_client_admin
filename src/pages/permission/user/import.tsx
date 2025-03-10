import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import _ from "lodash";
import { Button, Col, Form, Modal, notification, Popconfirm, Row, Table, Typography, Upload } from "antd";
import { useTranslation } from "react-i18next";
import { GENDER, MODE, EXCEL_USER_CONFIG_FIELD, BasicStatus, BasicStatusCode } from "#/enum";
import { UploadFile } from "antd/lib";
import { PlusOutlined } from "@ant-design/icons";
import * as XLSX from 'xlsx';
import moment from 'moment';
import { ColumnsType } from "antd/es/table";
import { find } from 'lodash';
import ProTag from '@/theme/antd/components/tag';
import userService from "@/api/services/userService";

type Props = {
  reload: () => void
  readOnly?: boolean;
};

const RouterImport = forwardRef(({ reload, readOnly }: Props, ref) => {
  const { t } = useTranslation()

  const refDetail = useRef<any>()

  const [loading, setLoading] = useState(false)

  const [isOpen, setIsOpen] = useState(false);

  const refMode = useRef<{ data?: any, mode: string }>({
      data: undefined,
      mode: MODE.CREATE
  })

  useImperativeHandle(ref, () => ({
      create: (_data: any) => {
          refMode.current = {
              data: _data,
              mode: MODE.CREATE
          }
          setIsOpen(true)
      },
      update: (_data: any) => {
          refMode.current = {
              data: _data,
              mode: MODE.UPDATE
          }
          setIsOpen(true)
      },
  }));

  const afterOpenChange = (_open: boolean) => {
      if (_open) {
          if (refMode.current?.mode == MODE.CREATE) {
              refDetail.current.create(refMode.current?.data)
          }
          if (refMode.current?.mode == MODE.UPDATE) {
              refDetail.current.update(refMode.current?.data)
          }
      }
  }

  const closeModal = () => {
      setIsOpen(false);
  };

  const confirmClose = () => {
      setIsOpen(false);
  };

  const submitFile = () => {
      refDetail.current.submit()
  }

  return (
      <>
          <Modal
              title={"Import"}
              open={isOpen}
              destroyOnClose
              onCancel={closeModal}
              afterOpenChange={afterOpenChange}
              styles={{
                  body: { maxHeight: "calc(100vh - 200px)" },
              }}
              width={1000}
              centered
              footer={[
                  <Popconfirm
                      placement="topRight"
                      title={t("common.confirm.close_request")}
                      description={t("common.confirm.description_close_request")}
                      onConfirm={confirmClose}
                  >
                      <Button
                          key="close-request"
                          loading={loading}
                          type="primary"
                          danger
                      >
                          {t("common.cancel")}
                      </Button>
                  </Popconfirm>,
                  <Button key="submit"
                      type="primary"
                      onClick={submitFile}
                      disabled={refMode.current.mode === MODE.VIEW}
                      loading={loading}
                  >
                      {t("common.save")}
                  </Button>,
                  <Button
                      key="close"
                      loading={loading}
                      onClick={closeModal}
                  >
                      {t("common.close")}
                  </Button>,
              ]}
          >
              <RouterImportForm
                  ref={refDetail}
                  setLoading={setLoading}
                  reload={reload}
                  closeModal={closeModal}
                  readOnly={readOnly}
              />
          </Modal>
      </>
  );
})

export default RouterImport;


type FormProps = {
  reload: () => void
  readOnly?: boolean;
  setLoading: (i: boolean) => void
  closeModal: () => void
};

type Error = {
  [key: string]: string | null;
}

const emptyValidate: Error = {
  name: null,
};

type PropKey = keyof any;

export const RouterImportForm = forwardRef(({
  setLoading,
  reload,
  closeModal
}: FormProps, ref) => {

  const { t } = useTranslation()

  const [mode, setMode] = useState<string>(MODE.CREATE);

  const [param, setParam] = useState<any>([]);

  const [errors, setErrors] = useState<Error>(emptyValidate);

  const [file, setFile] = useState<UploadFile>()

  useEffect(() => {
      loadMaster()
  }, [])

  const update = async () => {

  };

  const create = async () => {
      setParam([]);
      setMode(MODE.CREATE)
  };

  useImperativeHandle(ref, () => ({
      create: create,

      update: update,

      submit: submitFile,

      reset: resetData
  }));

  const loadMaster = async () => {

  };

  const performValidate = async (
      props: PropKey[],
      _currentParam: any
  ) => {
      let _errors: Error = _.cloneDeep(errors);

      if (props.length === 0) {
          for (const property in _errors) {
              props.push(property as PropKey);
          }
      }

      setErrors(_errors);

      let isValid = true;
      for (const key in _errors) {
          if (_errors[key]) {
              isValid = false;
          }
      }
      return isValid;
  };


  const submitFile = async () => {

      let _payload: any = _.cloneDeep(param);
      let isValid = true;
      isValid = await performValidate([], _payload);

      if (isValid) {

          switch (mode) {
              case MODE.CREATE:
                  setLoading(true);
                  userService.import(_payload).then((res: any) => {
                      if (res) {
                          if (closeModal) {
                              closeModal()
                          }
                          if (reload) {
                              reload()
                          }
                          notification.success({
                              message: t('common.success'),
                              duration: 3,
                          });
                      }
                      setLoading(false);
                  }).catch((_e: any) => {
                      setLoading(false);
                  })
                  break
              // case MODE.UPDATE:
              //     setLoading(true);
              //     driveService.getAll().then(res => {
              //         if (res) {
              //             if (closeModal) {
              //                 closeModal()
              //             }
              //             if (reload) {
              //                 reload()
              //             }
              //             notification.success({
              //                 message: t('common.success'),
              //                 duration: 3,
              //             });
              //         }
              //         setLoading(false);
              //     }).catch((_e: any) => {
              //         setLoading(false);
              //     })
              //     break

          }
      }
  };

  const resetData = () => {
      setParam([]);
  };

  const handleChange = (_file: any) => {
      setFile(_file);
      upload(_file)
      return false
  }

  const onRemove = () => {
      setFile(undefined);
      setParam([])
  }

  const upload = (f: any) => {
      const reader = new FileReader();
      reader.onload = async (evt: any) => {
          /* Parse data */
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          /* Get first worksheet */
          let ds: any = []
          wb.SheetNames.map(wsname => {
              const ws = wb.Sheets[wsname];
              /* Convert array of arrays */
              // @ts-ignore 
              var XL_row_object = XLSX.utils.sheet_to_row_object_array(ws);
              ds.push({
                  name: wsname,
                  data: XL_row_object
              })
          })

          let _params: any = [];
          ds.map((o: any) => {
              if (o.data.length) {
                  o.data.map((item: any) => {
                      let date = null
                      if (item[EXCEL_USER_CONFIG_FIELD.birthDate]) {
                          const [day, month, year] = item[EXCEL_USER_CONFIG_FIELD.birthDate].split('/');
                          date = new Date(`${year}-${month}-${day}T00:00:00Z`);
                      }
                      let expirationAt = null
                      if (item[EXCEL_USER_CONFIG_FIELD.expirationAt]) {
                          expirationAt = new Date(item[EXCEL_USER_CONFIG_FIELD.expirationAt]);
                      }
                      let _item = {
                          username: item[EXCEL_USER_CONFIG_FIELD.username],
                          fullName: item[EXCEL_USER_CONFIG_FIELD.fullName],
                          birthDate: date,
                          email: item[EXCEL_USER_CONFIG_FIELD.email],
                          phone: item[EXCEL_USER_CONFIG_FIELD.phone],
                          expirationAt,
                          userGroupName: item[EXCEL_USER_CONFIG_FIELD.userGroupName],
                          orgName: item[EXCEL_USER_CONFIG_FIELD.orgName],
                          titleName: item[EXCEL_USER_CONFIG_FIELD.titleName],
                          state: item[EXCEL_USER_CONFIG_FIELD.state] === t('common.active') ? 'active' : 'inactive',
                          gender: item[EXCEL_USER_CONFIG_FIELD.gender] ? item[EXCEL_USER_CONFIG_FIELD.gender] == "Nam" ? GENDER.MALE : GENDER.FEMALE : null,
                      }
                      _params.push(_item);
                  })
              }
          })
          setParam(_params)

      };
      reader.readAsBinaryString(f);
  }

  const uploadButton = (
      <button style={{ border: 0, background: 'none' }} type="button">
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
      </button>
  );

  const columns: ColumnsType = [
      {
          title: 'STT',
          dataIndex: 'STT',
          width: 50,
          align: 'center',
          render: (_, __, index) => <div>{index + 1}</div>,
      },
      {
          title: t('common.full_name'),
          dataIndex: 'fullName',
          width: 300,
      },
      {
          title: t('common.user_screen.birthday'),
          dataIndex: 'birthDate',
          width: 200,
          render: (_e, record) => <Typography.Text>{record?.birthDate ? moment(record?.birthDate).format("DD/MM/YYYY") : null}</Typography.Text>,
      },

      {
          title: t('common.drive.gender'),
          dataIndex: 'gender',
          width: 300,
          render: (_e, record) => {
              const gender = find(GENDER.list, { id: record.gender })
              return <Typography.Text>{gender ? t(gender?.name) : null}</Typography.Text>
          },
      },
      {
          title: t('common.transport.org'),
          dataIndex: 'orgName',
          width: 300,
          render: (_e, record) => {
              return <Typography.Text>{record.orgName}</Typography.Text>
          },
      },
      {
          title: t('common.user_screen.title'),
          dataIndex: 'titleName',
          width: 300,
          render: (_e, record) => {
              return <Typography.Text>{record.titleName}</Typography.Text>
          },
      },
      {
          title: t('common.user_screen.role'),
          dataIndex: 'userGroupName',
          width: 200,
      },
      {
          title: t('common.state'),
          dataIndex: 'state',
          align: 'center',
          width: 120,
          render: (state) => (
              // @ts-ignore
              <ProTag color={BasicStatusCode[state?.toUpperCase()]}>
                  {t(`common.${BasicStatus[state?.toUpperCase()]?.toLocaleLowerCase()}`)}
              </ProTag>
          ),
      }
  ];

  return <Form layout="vertical">
      <Row gutter={24}>
          <Col span={24} className="mb-3">
              <Typography.Text className="font-bold">{t("common.weather_cate.file")}</Typography.Text>
          </Col>
          <Col span={24} className="mb-3">
              <Upload
                  listType="picture-card"
                  fileList={file ? [file] : []}
                  beforeUpload={handleChange}
                  onRemove={onRemove}
              >
                  {file ? null : uploadButton}
              </Upload>
          </Col>
          <Col span={24} className="mb-3">
              <Typography.Text className="font-bold">{t("common.weather_cate.info")}</Typography.Text>
          </Col>
          <Col span={24}>
              <Table
                  bordered
                  rowKey="id"
                  size="small"
                  scroll={undefined}
                  columns={columns}
                  dataSource={param}
              />
          </Col>
      </Row>

  </Form>
})
